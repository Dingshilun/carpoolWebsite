var mysql=require('./mysqlconnect')
var tool=require('./utility')

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
    sql=sql+" Departure="+tool.bag(Departure)
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
    sql=sql+" Destination="+tool.bag(Destination)
  }
  if (D_date!=null)
  {count++
    if (count>1) sql=sql+' and'
    sql=sql+" D_date="+tool.bag(D_date)
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
      if(callback)callback('success');
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
      mysql.query('select @@IDENTITY',function(qerr,vals,fields){
        console.log(vals[0]['@@IDENTITY']);
        exports.JoinCarpool(vals[0]['@@IDENTITY'],userID,callback('success'));
      })

    }
  })
}
