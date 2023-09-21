import { Request, Response, NextFunction } from 'express'
import { body, validationResult } from 'express-validator'
import path from 'path'

const vietnameseLettersRegex = /^[a-zA-ZÀ-ỹ0-9\s]+$/

export const loginValidation = () => {
  return [body('username').notEmpty().withMessage('Yêu cầu nhập tài khoản')]
}

export const registerValidation = () => {
  return [
    body('username')
      .notEmpty()
      .withMessage('Yêu cầu nhập tài khoản')
      .isAlphanumeric()
      .withMessage('Yêu cầu không nhập kí tự đặc biệt'),
    body('password1')
      .notEmpty()
      .withMessage('Yêu cầu nhập mật khẩu')
      .isLength({ min: 8 })
      .withMessage('Mật khẩu phải có trên 8 kí tự'),
    body('email').notEmpty().withMessage('Yêu cầu nhập email').isEmail().withMessage('Yêu cầu nhập đúng email'),
    body('fullname')
      .notEmpty()
      .withMessage('Yêu cầu nhập họ tên')
      .matches(vietnameseLettersRegex)
      .withMessage('Tên không được chứa số và kí tự đặc biệt'),
    body('address').notEmpty().withMessage('Yêu cầu nhập địa chỉ'),
    body('phone').notEmpty().isNumeric().withMessage('Yêu cầu nhập số điện thoại')
  ]
}

export const userUpdateValidation = () => {
  return [
    body('fullname')
      .notEmpty()
      .withMessage('Yêu cầu nhập họ tên')
      .matches(vietnameseLettersRegex)
      .withMessage('Tên không được chứa số và kí tự đặc biệt'),
    body('address').notEmpty().withMessage('Yêu cầu nhập địa chỉ'),
    body('phone').notEmpty().isNumeric().withMessage('Yêu cầu nhập số điện thoại')
  ]
}

export const resetPassword = () => {
  return [
    body('oldpassword').notEmpty().withMessage('Yêu cầu nhập mật khẩu cũ'),
    body('newpassword1')
      .notEmpty()
      .withMessage('Yêu cầu nhập mật khẩu mới')
      .isLength({ min: 6 })
      .withMessage('Mật khẩu phải có trên 6 kí tự')
  ]
}

export const forgotPassword = () => {
  return [
    body('newpassword1')
      .notEmpty()
      .withMessage('Yêu cầu nhập mật khẩu mới')
      .isLength({ min: 8 })
      .withMessage('Mật khẩu phải có trên 8 kí tự')
  ]
}

export const storeValidation = () => {
  return [
    body('name')
      .notEmpty()
      .withMessage('Yêu cầu nhập tên sản phẩm')
      .matches(vietnameseLettersRegex)
      .withMessage('Yêu cầu tên sản phẩm không nhập kí tự đặc biệt'),
    body('origin')
      .notEmpty()
      .withMessage('Yêu cầu nhập xuất xứ')
      .matches(vietnameseLettersRegex)
      .withMessage('Yêu cầu xuất xứ không nhập kí tự đặc biệt và chữ số'),
    body('quantity').notEmpty().isNumeric().withMessage('Yêu cầu nhập số lượng'),
    body('costprice').notEmpty().isNumeric().withMessage('Yêu cầu nhập giá nhập'),
    body('price').notEmpty().isNumeric().withMessage('Yêu cầu nhập giá bán'),
    body('description').notEmpty().withMessage('Yêu cầu nhập mô tả sản phẩm')
  ]
}
