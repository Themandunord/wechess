import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

export default function () {

  Meteor.methods({

    sendVerificationLink(locale, subject) {
      check(locale, String);
      check(subject, String);

      let userId = Meteor.userId();
      if ( userId ) {

        Accounts.emailTemplates.siteName = Meteor.settings.public.appName;
        Accounts.emailTemplates.from     = Meteor.settings.private.FROM_EMAIL;

        Accounts.emailTemplates.verifyEmail = {
          subject() {
            return subject;
          },
          html(user, url) {
            console.log(user,url);

            SSR.compileTemplate( 'verifyEmail', Assets.getText( 'email/templates/'+locale+'/verify-email.html' ) );
            return SSR.render( 'verifyEmail', {
              emailAddress: user.emails[0].address,
              urlWithoutHash: url.replace( '#/', '' ),
              supportEmail: Meteor.settings.private.FROM_EMAIL
            });
          }
        };

        return Accounts.sendVerificationEmail( userId );
      }
    },

    sendResetPasswordLink(email) {

      check(email, String);

      let user = Accounts.findUserByEmail(email);

      if (!user){
        throw new Meteor.Error(500, '这个邮件地址不存在！', 'the email is not found');
      }

      Accounts.emailTemplates.siteName = Meteor.settings.public.appName;
      Accounts.emailTemplates.from     = Meteor.settings.private.FROM_EMAIL;

      Accounts.emailTemplates.resetPassword = {
        subject() {
          return `[${Meteor.settings.public.appName}] Reset Your Password`;
        },
        html(user, url) {

          SSR.compileTemplate( 'verifyEmail', Assets.getText( 'email/templates/verify-email.html' ) );
          return SSR.render( 'verifyEmail', {
            emailAddress: email,
            urlWithoutHash: url.replace( '#/', '' ),
            supportEmail: Meteor.settings.private.FROM_EMAIL
          });
        }
      };

      return Accounts.sendResetPasswordEmail(user._id,email);
    },




    sendGameInvitation(data) {

      check(data, {
        email: String,
        gameUrl: String,
        invitator: String,
        gameType: String,
        locale: String,
        appName: String,
        subject: String,
      });

      SSR.compileTemplate( 'invitationEmail', Assets.getText( 'email/templates/'+data.locale+'/invitation-email.html' ) );

      if ( data.email.includes( '@' ) ) {
        Meteor.defer( () => {
          Email.send({
            to: data.email,
            from: Meteor.settings.private.FROM_EMAIL,
            subject: data.subject,
            html: SSR.render( 'invitationEmail', data )
          });
        });
      }
    },


  });
}
