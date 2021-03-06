'use strict'

module.exports = (callbackId, token, channel, user) => {
  return {
    token,
    channel: channel,
    text: 'New Signup!',
    attachments: [{
      title: user.email,
      fields: [{
        title: 'Agreed to CoC?',
        value: user.coc == 'on' ? 'Yes' : 'No',
        short: true
      }],
      author_name: user.name,
      author_icon: 'https://api.slack.com/img/api/homepage_custom_integrations-2x.png'
    }, {
      title: 'WWCode Feedback',
      text: user.feedback
    }, {
      title: 'Would you like to invite this person?',
      callback_id: callbackId,
      color: '#3AA3E3',
      attachment_type: 'default',
      actions: [{
        name: 'invite',
        text: 'Invite',
        type: 'button',
        value: user.email
      }, {
        name: 'no',
        text: 'No',
        type: 'button',
        value: ''
      }]
    }]
  }
}
