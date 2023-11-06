import { Request, Response, NextFunction } from 'express';
import axios, { Axios, AxiosResponse } from 'axios';
import { getToken, verifyIfTransferCodeIsUsed, saveTransfer, CustomError } from '../utils/utils';
import asyncLock from 'async-lock';

const ENV: string = process.env.ENV ?? 'dev';
const lock = new asyncLock();

export const getPaymentInformation = async (req: Request, res: Response) => {
    try {
        let email = req.params.email;
        let result: AxiosResponse = await axios.get(
            `https://${ENV}.developers-test.currencybird.cl/payment?email=${email}&transferCode=${email}`, {      
            headers: { 'Authorization': await getToken(email)}
        });

        return res.send(result.data);
    } catch (error: any) {
        const statusError = error.response.status;
        const statusText = error.response.statusText;

        res.status(statusError).send(statusText);
    }
}

export const postPay = async (req: Request, res: Response) => {
    try {
        await lock.acquire('resourceLock', async () => {
            let transferCode = req.body.trasnferCode;
            let amount = req.body.amount;
            let email = req.params.email; 

            const data = await verifyIfTransferCodeIsUsed(transferCode);
            if (data != 0) {
                throw new CustomError('The stadusCode is in use', 400);
            }
            let result: AxiosResponse = await axios.post(
                `https://${ENV}.developers-test.currencybird.cl/payment?email=${email}&transferCode=${email}`,
                {
                    transferCode: transferCode,
                    amount: amount
                }, {
                    headers: { 'Authorization': await getToken(transferCode)}
                });
            
            if (result.data) {
                await saveTransfer(transferCode, amount);
            }
            return res.send(result.data);
        });
    } catch (error: any) {
        const statusError = error.response.status;
        const statusText = error.response.statusText;

        res.status(statusError).send(statusText);
    }
}