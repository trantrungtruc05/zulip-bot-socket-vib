import { Request, Response } from 'express';
import axios from 'axios';
import qs from 'qs';
import fs from 'fs';
import "../config/env";
import logger from "../utils/logger";


export let sendAll = async (req: Request, res: Response) => {

    if(req.get('x-api-key') === process.env.KEY){

        const resultGetUser = await axios.get(process.env.URL + 'users', {
            auth: {
                username: process.env.BOT_USERNAME,
                password: process.env.BOT_PASSWORD
            }
        });
    
    
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    
        const sqlite3 = require('sqlite3').verbose();
        let db = new sqlite3.Database('bot_db.db');
    
        var data = fs.readFileSync('content.txt', 'utf8');

        // var resultTestUser = new Array();
        // resultTestUser.push({email: 'tien.nguyenthe1@vib.com.vn', user_id: '8'});
        // resultTestUser.push({email: 'lam.nguyenbao@vib.com.vn', user_id: '11'});
        // resultTestUser.push({email: 'truc.trantrung@vib.com.vn', user_id: '19'});

        // for (var i = 0; i < resultTestUser.length; i++) {
    
        //     const requestBody = {
        //         type: "private", to: '[' + resultTestUser[i].user_id + ']', content: data.toString()
        //     }
    
        //     let sql = 'SELECT * FROM message_info where email = ?';
        //     let emailQuery = resultTestUser[i].email;
    
        //     db.get(sql, [emailQuery], async (err, row) => {
        //         if (err) {
        //             throw err;
        //         }
        //         if (!row) {
    
        //             logger.info('Message send to: ' + emailQuery + ' with [REQUEST] ' + JSON.stringify(requestBody));
        //             const resultSendMessage = await axios.post(process.env.URL + 'messages', qs.stringify(requestBody)
        //                 , {
        //                     headers,
        //                     auth: {
        //                         username: process.env.BOT_USERNAME,
        //                         password: process.env.BOT_PASSWORD
        //                     }
        //                 }).then(response => {
        //                     logger.info('Send first time success ' + response);
        //                     db.run(`INSERT INTO message_info(email, status, date_created) VALUES(?,?,?)`, [emailQuery, 'true', new Date().toString()], function (err) {
        //                         if (err) {
        //                             return console.log(err.message);
        //                         }
        //                         logger.info(`Email success inserted with rowid ${this.lastID}`);
        //                     });
        //                 })
        //                 .catch(error => {
        //                     logger.error('Send first time error ');
        //                     db.run(`INSERT INTO message_info(email, status, date_created) VALUES(?,?,?)`, [emailQuery, 'false', new Date().toString()], function (err) {
        //                         if (err) {
        //                             return console.log(err.message);
        //                         }
        //                         logger.error(`Email fail inserted with rowid ${this.lastID}`);
        //                     });
    
        //                 });
    
    
        //         } else {
        //             if (row.status === 'false') {
        //                 const resultSendMessage = await axios.post(process.env.URL + 'messages', qs.stringify(requestBody)
        //                     , {
        //                         headers,
        //                         auth: {
        //                             username: process.env.BOT_USERNAME,
        //                             password: process.env.BOT_PASSWORD
        //                         }
        //                     }).then(response => {
        //                         logger.info('Send again success ' + response);
        //                         db.run(`UPDATE message_info SET status = ?, date_created = ? WHERE email = ?`, ['true', new Date().toString(), emailQuery], function (err) {
        //                             if (err) {
        //                                 return console.log(err.message);
        //                             }
        //                             logger.info(`Email success rows updated ${this.changes}`);
        //                         });
        //                     })
        //                     .catch(error => {
        //                         logger.error('Send again error ');
    
        //                     });
        //             }
        //         }
    
        //     });
    
    
    
    
        // }



    
        for (var i = 0; i < resultGetUser.data.members.length; i++) {
    
            const requestBody = {
                type: "private", to: '[' + resultGetUser.data.members[i].user_id + ']', content: data.toString()
            }
    
            let sql = 'SELECT * FROM message_info where email = ?';
            let emailQuery = resultGetUser.data.members[i].email;
    
            db.get(sql, [emailQuery], async (err, row) => {
                if (err) {
                    throw err;
                }
                if (!row) {
    
                    logger.info('Message send to: ' + emailQuery + ' with [REQUEST] ' + JSON.stringify(requestBody));
                    const resultSendMessage = await axios.post(process.env.URL + 'messages', qs.stringify(requestBody)
                        , {
                            headers,
                            auth: {
                                username: process.env.BOT_USERNAME,
                                password: process.env.BOT_PASSWORD
                            }
                        }).then(response => {
                            logger.info('Send first time success ' + response);
                            db.run(`INSERT INTO message_info(email, status, date_created) VALUES(?,?,?)`, [emailQuery, 'true', new Date().toString()], function (err) {
                                if (err) {
                                    return console.log(err.message);
                                }
                                logger.info(`Email success inserted with rowid ${this.lastID}`);
                            });
                        })
                        .catch(error => {
                            logger.error('Send first time error ' + error);
                            db.run(`INSERT INTO message_info(email, status, date_created) VALUES(?,?,?)`, [emailQuery, 'false', new Date().toString()], function (err) {
                                if (err) {
                                    return console.log(err.message);
                                }
                                logger.error(`Email fail inserted with rowid ${this.lastID} with ${err}`);
                            });
    
                        });
    
    
                } else {
                    
                    if (row.status === 'false') {
                        const resultSendMessage = await axios.post(process.env.URL + 'messages', qs.stringify(requestBody)
                            , {
                                headers,
                                auth: {
                                    username: process.env.BOT_USERNAME,
                                    password: process.env.BOT_PASSWORD
                                }
                            }).then(response => {
                                logger.info('Send again success ' + response);
                                db.run(`UPDATE message_info SET status = ?, date_created = ? WHERE email = ?`, ['true', new Date().toString(), emailQuery], function (err) {
                                    if (err) {
                                        return console.log(err.message);
                                    }
                                    logger.info(`Email success rows updated ${this.changes}`);
                                });
                            })
                            .catch(error => {
                                
                                logger.error('Send again error ' + error);
    
                            });
                    }
                }
    
            });
    
    
    
    
        }
    
    
        res.status(200).send({ status: 'success' });

    }else{
        res.status(401).send({ message: 'Unauthorized' });
    }

    

}

export let reply = async (req: Request, res: Response) => {

    const { content } = req.body;

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    const requestBody = {
        type: "stream", to: "Zulip Jitsi Support", topic: "general", content: content
        // type: "private", to: "[19]", content: content
    }

    logger.info('[REQUEST] ' + JSON.stringify(requestBody));

    const resultSendMessage = await axios.post(process.env.URL + 'messages', qs.stringify(requestBody)
        , {
            headers,
            auth: {
                username: process.env.BOT_USERNAME,
                password: process.env.BOT_PASSWORD
            }
        }).then(response => {
            logger.info('Send reply to stream success ');
            res.status(200).send({ status: 'success' });
        })
        .catch(error => {
            console.log('--- ' + error)
            logger.error('Send again error ' + error);
            res.status(500).send({ status: 'fail' });

        });

    

}
