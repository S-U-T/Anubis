from email.mime import text

import smtplib as asmtp

from anubis.util import argmethod
from anubis.util import options

options.define('smtp_host', default='smtp.qq.com', help='SMTP server')
options.define('smtp_port', default=465, help='SMTP server port')
options.define('smtp_user', default='acm_mail@ikazuchi.cn', help='SMTP username')
options.define('smtp_password', default='emymknobimmlbbnb', help='SMTP password')
options.define('mail_from', default='acm@sut.edu.cn', help='Mail from')


@argmethod.wrap
async def send_mail(to: str, subject: str, content: str):
    _server = asmtp.SMTP_SSL(host=options.options.smtp_host, port=options.options.smtp_port)
    msg = text.MIMEText(content, _subtype='html', _charset='UTF-8')
    msg['Subject'] = subject
    msg['From'] = options.options.mail_from
    msg['To'] = to

    _server.ehlo()
    _server.login(options.options.smtp_user, options.options.smtp_password)
    _server.sendmail(options.options.mail_from, to, msg.as_string())


if __name__ == '__main__':
    argmethod.invoke_by_args()
