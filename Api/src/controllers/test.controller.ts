import { Request, Response, NextFunction } from 'express';
import axios, { Axios, AxiosResponse } from 'axios';
import { sleep, verifyIfTransferCodeIsUsed, CustomError } from '../utils/utils';
import asyncLock from 'async-lock';

const lock = new asyncLock();

const ENV: string = process.env.ENV ?? 'dev';
  
export const testFunction = async (req: Request, res: Response, next: NextFunction) => {
    let result: AxiosResponse = await axios.get(`https://jsonplaceholder.typicode.com/todos/1`);
    return res.send(result.data);
}

export const getToken = async (req: Request, res: Response) => {
    let email = req.params.email;
    let result: AxiosResponse = await axios.get(`https://${ENV}.developers-test.currencybird.cl/token?email=${email}`);
    return res.send(result.data);
}

export const dummyTestLock = async (req: Request, res: Response) => {
    try {
        await lock.acquire('resourceLock', async () => {

            let letter: string = req.query.letter as string?? 'A';
            let iterations: number = parseInt(req.query.counter as string?? '5');
            for (let count = 1; count <= iterations; count++) {
                console.log(`El dummy con la letra ${letter} va en ${count}`)
                await sleep(1000)
            }
            return res.send('El dummy fue activado :o');
        });
    } catch (error: any) {
        res.status(500).send('Failed to access the resource.');
    }
    
}

export const testBD = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let transferCode = req.body.transferCode;
        const data = await verifyIfTransferCodeIsUsed(transferCode);
        if (data != 0) {
            throw new CustomError('The stadusCode is in use', 400);
        }
        return res.send(data);
    } catch (error: any) {
        const statusError = error.response.status;
        const statusText = error.response.statusText;

        res.status(statusError).send(statusText);
    }
    
}