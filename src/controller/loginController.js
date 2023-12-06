import UserModel from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cart from '../models/cart.js';
import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
async function sendOTPtoEmail(email, otp) {
  // create a nodemailer transporter using your SMTP credentials
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER, // your email address
      pass: process.env.EMAIL_PASSWORD, // your email password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.EMAIL_USER, // sender address
    to: email, // list of receivers
    subject: 'Mã xác nhận quên mật khẩu', // subject line

    html: `
    <head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your login</title>
  <!--[if mso]><style type="text/css">body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }</style><![endif]-->
</head>

<body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
  <table role="presentation"
    style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
    <tbody>
      <tr>
        <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
          <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
            <tbody>
              <tr>
                <td style="padding: 40px 0px 0px;">
                  <div style="text-align: left;">
                    <div style="padding-bottom: 20px;"><img src="https://i.ibb.co/Qbnj4mz/logo.png" alt="Company" style="width: 56px;"></div>
                  </div>
                  <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                    <div style="color: rgb(0, 0, 0); text-align: left;">
                      <h1 style="margin: 1rem 0">Mã OTP</h1>
                      <p style="padding-bottom: 16px">Hãy sử dụng mã OTP bên dưới để đặt lại mật khẩu.</p>
                      <p style="padding-bottom: 16px"><strong style="font-size: 130%">${otp}</strong></p>
                      <p style="padding-bottom: 16px">Nếu bạn không gửi yêu cầu, hãy bỏ qua tin nhắn này.</p>
                      <p style="padding-bottom: 16px">Xin cám ơn,<br>Dialuxury.</p>
                    </div>
                  </div>
                
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  `,
  });

  console.log('Message sent: %s', info.messageId);
}
export async function register(req, res) {
  try {
    const { name, password, email, address, phone } = req.body;
    console.log(email);
    const existEmail = new Promise(async function (resolve, reject) {
      const emailexist = await UserModel.findOne({ email });

      if (emailexist) reject('Email already exists');

      resolve();
    });

    const existPhone = new Promise(async function (resolve, reject) {
      const phoneexist = await UserModel.findOne({ phone });

      if (phoneexist) reject('Phone already exists');

      resolve();
    });

    // check for existing email

    Promise.all([existEmail, existPhone])
      .then(() => {
        if (password) {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              const user = new UserModel({
                name,
                password: hashedPassword,
                address,
                phone,
                email,
              });

              // return save result as a response
              user
                .save()
                .then((result) => {
                  const cartCreate = cart.create({
                    userId: result._id.toString(),
                  });
                  cartCreate
                    .then(function () {
                      res
                        .status(201)
                        .send({ msg: 'User Register Successfully' });
                    })
                    .catch(function (error) {
                      console.log(error);
                      res.status(501).send({ msg: 'cart error' });
                    });
                })
                .catch((error) => res.status(500).send('Error when register'));
            })
            .catch((error) => {
              return res.status(500).send({
                error: 'Unable to hashed password',
              });
            });
        }
      })
      .catch((error) => {
        return res.status(500).send({ error });
      });
  } catch (error) {
    console.log(error);
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  const role = 'user';
  try {
    UserModel.findOne({ email })
      .then(function (user) {
        console.log(1);
        bcrypt
          .compare(password, user.password)
          .then(function (passwordCheck) {
            console.log(passwordCheck);
            if (!passwordCheck) return res.status(402).send('wrong!');

            //create JWT TOKEN
            const token = jwt.sign(
              {
                userId: user._id,
                email: user.email,
              },
              'WNi3oF3NfduzvwUiOPlnDdUUjIlMcv7fX28ms3udpPM',

              { expiresIn: '24h' }
            );
            return res.status(200).send({
              msg: 'Login Successfully',
              _id: user._id,
              token,
              ten: user.name,
              role,
            });
          })
          .catch(function (error) {
            console.log(error);
            return res.status(401).send('Password is not correct');
          });
      })
      .catch(function (error) {
        return res.status(409).send('email not found');
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
}
export async function loginAdmin(req, res) {
  const { email, password, role } = req.body;

  try {
    UserModel.findOne({ email: email, role: 'admin' })
      .then(function (user) {
        bcrypt
          .compare(password, user.password)
          .then(function (passwordCheck) {
            console.log(passwordCheck);
            if (!passwordCheck) return res.status(402).send('wrong!');

            //create JWT TOKEN
            const token = jwt.sign(
              {
                userId: user._id,
                email: user.email,
              },
              'WNi3oF3NfduzvwUiOPlnDdUUjIlMcv7fX28ms3udpPM',

              { expiresIn: '24h' }
            );
            return res.status(200).send({
              msg: 'Login Successfully',
              _id: user._id,
              token,
              ten: user.name,
              role1: 'admin',
            });
          })
          .catch(function (error) {
            console.log(error);
            return res.status(401).send('Password is not correct');
          });
      })
      .catch(function (error) {
        return res.status(409).send('not admin');
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
}
//middleware verify user

export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method == 'GET' ? req.query : req.body;

    let exist = await UserModel.findOne({ username });
    if (!exist) return res.status(404).send({ error: 'can not find user' });
    next();
  } catch (error) {
    return res.status(500).send({ error: 'Authentication failed' });
  }
}

export async function getUser(req, res) {
  const { email } = req.params; //get parameter
  const OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  try {
    if (!email) return res.status(501).send({ error: 'invalid email' });

    UserModel.findOne({ email })
      .then(async function (user) {
        if (!user)
          return res.status(501).send({ error: 'could not find the user' });

        user.otp = OTP;

        await user.save();
        sendOTPtoEmail(email, OTP);
        const { password, ...rest } = user.toJSON();
        return res.status(201).send(rest);
      })
      .catch(function (error) {
        return res.status(500).send({ error });
      });
  } catch (error) {
    return res.status(409).send({ error: 'can not find user data' });
  }
}

export async function schedule(req, res) {}

export async function getUserbyId(req, res) {
  const { _id } = req.params; //get parameter
  try {
    if (!_id) return res.status(501).send({ error: 'invalid id' });

    UserModel.findOne({ _id })
      .then(function (user) {
        if (!user)
          return res.status(501).send({ error: 'could not find the user' });

        const { password, ...rest } = user.toJSON();
        return res.status(201).send(rest);
      })
      .catch(function (error) {
        return res.status(500).send({ error });
      });
  } catch (error) {
    return res.status(409).send({ error: 'can not find user data' });
  }
}

export async function updateUser(req, res) {
  try {
    const { _id } = req.body;
    const user = req.body.user;
    const { email, phone } = user;
    const userFound = await UserModel.findOne({ _id: _id });
    console.log(userFound);
    const existEmail = new Promise(async function (resolve, reject) {
      if (userFound.email === email) resolve();
      else {
        const emailexist = await UserModel.findOne({ email });

        if (emailexist) reject('Email already exists');

        resolve();
      }
    });

    const existPhone = new Promise(async function (resolve, reject) {
      const userFound = await UserModel.findOne({ _id: _id });
      if (userFound.phone === phone) resolve();
      else {
        const phoneexist = await UserModel.findOne({ phone });

        if (phoneexist) reject('Phone already exists');

        resolve();
      }
    });
    Promise.all([existEmail, existPhone])
      .then(() => {
        if (_id) {
          const body = req.body.user;
          UserModel.findOne({ _id }).then(function (data) {
            if (!data) return res.status(404).send('User not found');
            UserModel.updateOne({ _id: _id }, body)
              .then(function (data) {
                return res.status(201).send('User Updated');
              })
              .catch(function (error) {
                return res.status(501).send({ error });
              });
          });
        } else return res.status(502).send('invalid user');
      })
      .catch(function (error) {
        return res.status(409).send({ error });
      });
  } catch (error) {
    return res.status(503).send({ error });
  }
}
export async function generateOTP(req, res) {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
}
export async function verifyOTP(req, res) {
  const { _id } = req.query; //get parameter
  const { code } = req.query;
  if (!_id) return res.status(504).send({ error: 'invalid email' });

  UserModel.findOne({ _id }).then(async function (user) {
    if (!user)
      return res.status(505).send({ error: 'could not find the user' });

    if (user.otp === code) {
      req.app.locals.resetSession = true;
      user.otp = null;
      await user.save();

      return res.status(201).send({ msg: 'Verify Successfully' });
    } else {
      return res.status(500).send({ msg: 'Invalid OTP' });
    }
  });
}
export async function createResetSession(req, res) {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false;
    return res.status(201).send({ msg: 'access granted' });
  } else {
    return res.status(440).send({ msg: 'session expired' });
  }
}

export async function resetPassword(req, res) {
  if (!req.app.locals.resetSession)
    return res.status(440).send({ msg: 'session expired' });

  const { _id, password } = req.body;
  try {
    UserModel.findOne({ _id }).then(function (user) {
      if (!user) return res.status(404).send({ error: 'username not found' });
      bcrypt.hash(password, 10).then(function (hashedPassword) {
        UserModel.updateOne({ _id: _id }, { password: hashedPassword })
          .then(function () {
            req.app.locals.resetSession = false;
            return res.status(201).send({ msg: 'password reseted' });
          })
          .catch(function (error) {
            return res.status(501).send({ error: 'can not reset password' });
          });
      });
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
}
export async function changepassword(req, res) {
  const { _id, newPassword, currentPassword } = req.body;
  console.log(currentPassword);
  try {
    UserModel.findOne({ _id }).then(function (user) {
      if (!user) return res.status(404).send({ error: 'username not found' });
      bcrypt
        .compare(currentPassword, user.password)
        .then(function (passwordCheck) {
          if (!passwordCheck)
            return res.status(502).send({ error: 'Password not correct' });
          else {
            bcrypt.hash(newPassword, 10).then(async function (hashedPassword) {
              UserModel.updateOne({ _id: _id }, { password: hashedPassword })
                .then(function () {
                  console.log(res);

                  return res.status(201).send({ msg: 'password reseted' });
                })
                .catch(function (error) {
                  console.log(error);
                  return res
                    .status(500)
                    .send({ error: 'can not reset password' });
                });
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
}
