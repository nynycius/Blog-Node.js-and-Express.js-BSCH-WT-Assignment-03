const moment = require('moment')

module.exports = {
   // main format :  'MMMM Do YYYY, h:mm:ss a'
  formatDate: function (date, format) {
    return moment(date).utc().format(format)
  },

  editIcon: function (blogPostUser, loggedUser, blogPostId, floating = true) {
    if (blogPostUser._id.toString() == loggedUser._id.toString()) {
      if (floating) {
        return `<a href="/adm/edit/${blogPostId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
      } else {
        return `<a href="/adm/edit/${blogPostId}"><i class="fas fa-edit"></i></a>`
      }
    } else {
      return ''
    }
  },


}