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
      .withMessage('Yêu cầu không nhập kí tự đặc biệt và dấu'),
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
    body('phone')
      .notEmpty()
      .isNumeric()
      .withMessage('Yêu cầu nhập số điện thoại')
      .isLength({ min: 10, max: 11 })
      .withMessage('Số điện thoại phải có 10 đến 11 số'),
    body('gender').notEmpty().withMessage('Yêu cầu giới tính'),
    body('birth').notEmpty().withMessage('Yêu cầu nhập địa chỉ')
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
      .withMessage('Yêu cầu tên sản phẩm không nhập kí tự đặc biệt')
      .isLength({ min: 3, max: 100 })
      .withMessage('Tên sản phẩm phải có độ dài từ 3 đến 100 kí tự'),
    body('origin')
      .notEmpty()
      .withMessage('Yêu cầu nhập xuất xứ')
      .matches(vietnameseLettersRegex)
      .withMessage('Yêu cầu xuất xứ không nhập kí tự đặc biệt và chữ số')
      .isLength({ min: 1, max: 50 })
      .withMessage('Xuất xứ sản phẩm phải có độ dài từ 1 đến 50 kí tự'),
    body('quantity')
      .notEmpty()
      .withMessage('Yêu cầu nhập số lượng')
      .isInt()
      .withMessage('Số lượng sản phẩm phải là số nguyên')
      .isInt({ min: 1 })
      .withMessage('Số lượng sản phẩm không được < 1')
      .isInt({ max: 100000 })
      .withMessage('Số lượng sản phẩm không được lớn hơn 100000'),
    body('costprice')
      .notEmpty()
      .withMessage('Yêu cầu nhập giá nhập')
      .isFloat()
      .withMessage('Giá nhập phải là số thực và dấu thập phân phải là dấu .')
      .isFloat({ min: 1000 })
      .withMessage('Giá nhập không được < 1000')
      .isFloat({ max: 1000000000 })
      .withMessage('Giá nhập không được lớn hơn 1000000000'),
    body('price')
      .notEmpty()
      .withMessage('Yêu cầu nhập giá bán')
      .isFloat()
      .withMessage('Giá bán phải là số thực và dấu thập phân phải là dấu .')
      .isFloat({ min: 1000 })
      .withMessage('Giá bán không được < 1000')
      .isFloat({ max: 1000000000 })
      .withMessage('Giá bán không được lớn hơn 1000000000'),
    body('description')
      .notEmpty()
      .withMessage('Yêu cầu nhập mô tả sản phẩm')
      .isLength({ min: 10, max: 255 })
      .withMessage('Mô tả sản phẩm phải có độ dài từ 10 - 255 kí tự')
  ]
}

export const updateValidation = () => {
  return [
    body('quantity')
      .notEmpty()
      .withMessage('Yêu cầu nhập số lượng')
      .isInt()
      .withMessage('Số lượng sản phẩm phải là số nguyên')
      .isInt({ min: 1 })
      .withMessage('Số lượng sản phẩm không được < 1')
      .isInt({ max: 100000 })
      .withMessage('Số lượng sản phẩm không được lớn hơn 100000'),
    body('costprice')
      .notEmpty()
      .withMessage('Yêu cầu nhập giá nhập')
      .isFloat()
      .withMessage('Giá nhập phải là số thực và dấu thập phân phải là dấu .')
      .isFloat({ min: 1000 })
      .withMessage('Giá nhập không được < 1000')
      .isFloat({ max: 1000000000 })
      .withMessage('Giá nhập không được lớn hơn 1000000000'),
    body('price')
      .notEmpty()
      .withMessage('Yêu cầu nhập giá bán')
      .isFloat()
      .withMessage('Giá bán phải là số thực và dấu thập phân phải là dấu .')
      .isFloat({ min: 1000 })
      .withMessage('Giá bán không được < 1000')
      .isFloat({ max: 1000000000 })
      .withMessage('Giá bán không được lớn hơn 1000000000')
  ]
}

export const storeVoucher = () => {
  return [
    body('name')
      .notEmpty()
      .withMessage('Yêu cầu nhập tên voucher')
      .matches(vietnameseLettersRegex)
      .withMessage('Yêu cầu tên voucher không nhập kí tự đặc biệt')
      .isLength({ min: 3, max: 100 })
      .withMessage('Tên voucher phải có độ dài từ 3 đến 20 kí tự'),
    body('quantity')
      .notEmpty()
      .withMessage('Yêu cầu nhập số lượng voucher')
      .isInt()
      .withMessage('Số lượng voucher phải là số nguyên')
      .isInt({ min: 1 })
      .withMessage('Số lượng voucher không được < 1'),
    body('discount')
      .notEmpty()
      .withMessage('Yêu cầu nhập Mức giảm giá')
      .isInt()
      .withMessage('Mức giảm giá phải là số nguyên')
      .isInt({ min: 1, max: 100 })
      .withMessage('Mức giảm giá phải từ 1 đến 100'),
    body('starttime').notEmpty().withMessage('Yêu cầu nhập ngày bắt đầu'),
    body('endtime').notEmpty().withMessage('Yêu cầu nhập ngày kết thúc')
  ]
}

export const addCreditcard = () => {
  return [
    body('fullname')
      .notEmpty()
      .withMessage('Yêu cầu nhập họ và tên')
      .matches(vietnameseLettersRegex)
      .withMessage('Yêu cầu họ và tên không nhập kí tự đặc biệt')
      .isLength({ min: 2, max: 50 })
      .withMessage('Tên voucher phải có độ dài từ 3 đến 20 kí tự'),
    body('address').notEmpty().withMessage('Yêu cầu nhập tên voucher'),
    body('cardnumber')
      .notEmpty()
      .withMessage('Yêu cầu nhập số thẻ')
      .isLength({ min: 16, max: 16 })
      .withMessage('Số thẻ phải chứa 16 số'),
    body('postalcode')
      .notEmpty()
      .withMessage('Yêu cầu nhập Mã bưu chính')
      .isLength({ min: 5, max: 5 })
      .withMessage('Mã bưu chính phải chứa 5 số'),
    body('outofdate').notEmpty().withMessage('Yêu cầu nhập ngày hết hạn'),
    body('CVV')
      .notEmpty()
      .withMessage('Yêu cầu nhập CVV')
      .isLength({ min: 3, max: 3 })
      .withMessage('CVV phải chứa 3 số')
  ]
}
