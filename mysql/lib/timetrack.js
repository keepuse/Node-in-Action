var qs = require('querystring')

exports.sendHtml  = function(res, html) {
	res.setHeader('Content-Type', 'text/html')
	res.setHeader('Content-Length', Buffer.byteLength(html))  
	res.end(html)
}

exports.parseReceivedData = function(req, cb) { // 解析post数据
	let body = ''
	res.setEncoding('utf8')
	res.on('data', function(chunk) {
		body += chunk
	})
	req.on('end', function() {
		let data = qs.parse(body)
		cb(data)
	})
}

exports.actionForm = function(id, path, label) {
	let html = '<form method="POST" action="' + path + '">' + 
    '<input type="hidden" name="id" value="' + id + '">' +
    '<input type="submit" value="' + label + '" />' +
    '</form>';
 	 return html;
}

// 用MySQL添加数据
exports.add = function(db, req, res) {
	exports.parseReceivedData(req, function(work) {
		db.query(
			'INSERT INTO work (hours, date, description)' + 'VALUES (?, ?, ?)',  // 添加工作记录的SQL
			[work.hours, work.date, work.description],  //工作记录数据
			function(err) {
			  	if (err) throw err
			  	exports.show(db, res)  //给用户显示工作记录清单
			} 
		)
	})
}

// 删除MySQL数据
exports.delete = function(db, req, res) {
	exports.parseReceivedData(req, function(work) {
		db.query(
			'DELETE FROM work WHERE id=?',
			[work.id],
			function(err) {
				if (err) throw err
				exports.show(db, res)
			}
		)
	})
}
// 更新MySQL数据
exports.archive = function(db, req, res) {
	exports.parseReceivedData(req, function(work) {
		db.query(
			'UPDATE work SET archived=1 WHERE id=?',
			[work.id],
			function(err) {
				if (err) throw err
				exports.show(db, res)
			}
		)
	})
}

// 获取MySQL数据
exports.show = function(db, res, showArchived) {
	let query = 'SELECT * FROM work ' + 
				'WHERE archived=? ' + 
				'ORDER BY date DESC'
	let archiveValue = (showArchived) ? 1 : 0
	db.query(
		query,
		[archiveValue], // 想要的工作状态
		function(err, rows) {
			if (err) throw err
			let html = (showArchived) ? '' 
			:  '<a href="http://epub.ituring.com.cn/archived">Archived Work</a><br/>'
			html += exports.workHitlistHtml(rows)
			html += exports.workFormHtml()
			exports.sendHtml(res, html)
		}
	)
}

// 渲染MySQL记录
exports.showArchived = function(db, res) {
	exports.show(db, res, true)
}

// 渲染MySQL记录
exports.workHitlistHtml = function(rows) {
	let html = '<table>'
  	for(let i in rows) {  // 将每条工作记录渲染为HTML表格中的一行
    	html += '<tr>'
		html += '<td>' + rows[i].date + '</td>'
		html += '<td>' + rows[i].hours + '</td>';
		html += '<td>' + rows[i].description + '</td>'
		if (!rows[i].archived) {  // 如果工作记录还没归档，显示归档按钮
	￼￼        html += '<td>' + exports.workArchiveForm(rows[i].id) + '</td>'
		}
		html += '<td>' + exports.workDeleteForm(rows[i].id) + '</td>'
		html += '</tr>'
	}
	html += '</table>'
	return html
}

// 渲染HTML表单
exports.workFormHtml = function() {
	let html = '<form method="POST" action="/">' +  // 渲染用来输入新工作记录的空白HTML表单
		￼'<p>Date (YYYY-MM-DD):<br/><input name="date" type="text"><p/>' +
		'<p>Hours worked:<br/><input name="hours" type="text"><p/>' +
		'<p>Description:<br/>' +
		'<textarea name="description"></textarea></p>' +
		'<input type="submit" value="Add" />' +
		'</form>'
	return html
}

exports.workArchiveForm = function(id) {  // 渲染归档按钮表单
	return exports.actionForm(id, '/archive', 'Archive')
}
exports.workDeleteForm = function(id) {  // 渲染删除按钮表单
	return exports.actionForm(id, '/delete', 'Delete')
}