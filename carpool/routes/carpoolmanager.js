var mysql=require('./mysqlconnect')
var tool=require('./utility')
var contactmanager=require('./contactmanager')
exports.ShowUserPool=function(UserID,callback){
  var sql='select * from joinpool natural join carpool where UserID='+tool.bag(UserID)+';'
  mysql.query(sql,function(qerr,vals,fields){
    callback('success',vals)
  })
}
exports.UsersInCarpool=function(PoolID,callback){
  var sql='select users.UserID,Pics from joinpool natural join users left join userPic on users.UserID=userPic.UserID where PoolID='+tool.bag(PoolID)+';'
  mysql.query(sql,callback)
}
exports.DeleteCarpool=function(PoolID,callback){
  var sql='delete from carpool where PoolID='+tool.bag(PoolID)+';'
  mysql.query(sql,function(qerr,vals,fields){
    if (qerr)
    {
      console.log(qerr);
      callback('fail')
    }else {
      callback('success')
    }
  })
}

exports.FilterCarpool=function(carpoolID,userID,Departure,Destination,D_date,callback){
  var sql='select * from carpool where'
  var count=0
  if (Departure!=null)
  {count++
    sql=sql+" Departure like "+tool.blur(Departure)
  }
  if (carpoolID!=null)
  {
    count++
    if (count>1) sql=sql+' and'
    sql=sql+' PoolID='+tool.bag(carpoolID)
  }
  if (userID!=null)
  {
    count++
    if (count>1) sql=sql+' and'
    sql=sql+" userID="+tool.bag(userID)
  }
  if (Destination!=null)
  {count++
    if (count>1) sql=sql+' and'
    sql=sql+" Destination LIKE "+tool.blur(Destination)
  }
  if (D_date!=null)
  {count++
    if (count>1) sql=sql+' and'
    sql=sql+" D_date LIKE"+tool.blur(D_date)
  }
  if(count==0){
    sql='select * from carpool order by PoolID desc limit 10;'
  }else{
    sql=sql+';'
  }
  console.log(sql);
  mysql.query(sql,function(qerr,vals,fields){
    if (qerr){
      callback('fail',null)
    }else{
      callback('success',vals)
    }
  })
}

exports.JoinCarpool=function(PoolID,UserID,callback){
  var sql='insert into joinpool values('+tool.bag(PoolID)+','+tool.bag(UserID)+');'
  mysql.query(sql,function(qerr,vals,fields){
    if (qerr)
    {
    }else {
      contactmanager.join_contact(UserID,PoolID,callback)
    }
  })
}

exports.QuitCarpool=function(PoolID,UserID,callback){
  var sql='delete from joinpool where PoolID='+tool.bag(PoolID)+' and UserID='+tool.bag(UserID)+';';
  mysql.query(sql,function(qerr,vals,fields){
    if (callback!=null)
    {
      callback('success')
    }
  })
}

exports.BeginCarpool=function(userID,Departure,Destination,D_date,Capacity,contact,callback)
{
  var sql="insert into carpool values(null,"+tool.bag(Departure)+','+tool.bag(Destination)+','+tool.bag(D_date)+','+Capacity+','+tool.bag(contact)+');'
  mysql.query(sql,function(qerr,vals,fields){
    if (qerr) {
      console.log(qerr);
      callback('fail')
    } else{

      //   console.log(vals[0]['@@IDENTITY']);
      //   contactmanager.begin_contact(vals[0]['@@IDENTITY'],Departure+'→'+Destination,exports.JoinCarpool(vals[0]['@@IDENTITY'],userID,callback('success')))
        var PoolID=vals.insertId
        console.log(">>>>>>>>>>>>>>POOLID",PoolID);
         contactmanager.begin_contact(PoolID,Departure+'→'+Destination,exports.JoinCarpool(PoolID,userID,callback('success')))
      }


  })
}
