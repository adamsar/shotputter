import { ValidationChain } from "express-validator";
export const optional = (checker: ValidationChain) => {
    return (isRequired: boolean) => isRequired ? checker.notEmpty() : checker;
}