import { Request, Response } from 'express';
import { ICompany } from '../models/domain/Company';
const Company = require("../models/domain/Company");

const getCompany = async (req: Request, res: Response) => {
    try {
        let company: ICompany = await Company.findOne({ _id: req.params.companyId }).exec();
        if (!company) return res.status(403).json({ 'message': 'Company not found.' });
        return res.status(200).json(company);
    } catch (err: any) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = {
    getCompany,
};