import axios, { Axios, AxiosResponse } from 'axios';
const { Transfers } = require("../../db/models");
const Sequelize = require("sequelize");

const ENV: string = process.env.ENV ?? 'dev';

export const getToken = async (email: string) => {
    let result: AxiosResponse = await axios.get(`https://${ENV}.developers-test.currencybird.cl/token?email=${email}`);
    return result.data;
}

export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const verifyIfTransferCodeIsUsed = async ( transferCode: string ) => {
    const transfer = await Transfers.findAll({
        attributes: [
            [Sequelize.fn('COUNT', Sequelize.col('transferCode')), 'total_transactions'],
        ],
        where: {
            transferCode: transferCode
        }
    });
    return transfer[0].dataValues.total_transactions;
}

export const saveTransfer = async (transferCode: string, amount: number) => {
    const newTransfer = await Transfers.create({
        transferCode: transferCode,
        amount: amount
    });
}

export class CustomError extends Error {
    
    response : {};
    constructor(message: string, status: number) {
      super(message);
      this.response = {
        status: status,
        statusText: message
    }
}}