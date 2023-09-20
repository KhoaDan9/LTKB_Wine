import { Request, Response, NextFunction } from 'express'
import { body, validationResult } from 'express-validator'
import path from 'path'

const vietnameseLettersRegex = /^[a-zA-ZÀ-ỹ\s]+$/

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
    body('email')
      .notEmpty()
      .withMessage('Yêu cầu nhập email')
      .isEmail()
      .withMessage('Yêu cầu nhập đúng email'),
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
      .isAlphanumeric()
      .withMessage('Yêu cầu không nhập kí tự đặc biệt'),
    body('origin')
      .notEmpty()
      .withMessage('Yêu cầu nhập nguồn gốc')
      .isAlphanumeric()
      .withMessage('Yêu cầu không nhập kí tự đặc biệt'),
    body('quantity')
      .notEmpty().isNumeric()
      .withMessage('Yêu cầu nhập số lượng'),
    body('costprice')
      .notEmpty().isNumeric()
      .withMessage('Yêu cầu nhập giá nhập'),
    body('price')
      .notEmpty().isNumeric()
      .withMessage('Yêu cầu nhập giá bán'),
    body('description')
      .notEmpty()
      .withMessage('Yêu cầu nhập mô tả sản phẩm'),
    body('imgUpload')
      .notEmpty()
      .withMessage('Yêu cầu nhập hình ảnh')
      .custom((value, { req }) => {
        // Kiểm tra định dạng ảnh
        if (!req.file) {
          throw new Error('Tệp tin không tồn tại');
        }

        const allowedExtensions = ['.png']; // Các đuôi file được cho phép
        const fileExtension = path.extname(req.file.originalname).toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
          throw new Error('Định dạng tệp tin không hợp lệ. Chỉ chấp nhận đuôi ".png"');
        }

        // Kiểm tra kích thước ảnh (kích thước tính bằng byte)
        if (req.file.size > 5 * 1024 * 1024) {
          throw new Error('Kích thước ảnh không được vượt quá 5MB');
        }

        return true;
      })
  ]
}
