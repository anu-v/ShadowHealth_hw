  var mongoose=require('mongoose');
  mongoose.connect('mongodb://localhost:27017/trivia', {useNewUrlParser: true});
  var db = mongoose.connection;
  var Schema = mongoose.Schema;

  var questionSchema= new Schema({
      number: {type:Number, required:true},
      question: {type:String, required:true},
      answer: {type:String, required:true},
      createdBy: {type:String, required:true}
  });

  var questionModel=mongoose.model('questions', questionSchema);

module.exports.getQuestions=  function() {
      return  new Promise(resolve =>{
            resolve(questionModel.find({}).then(function(allquestions){
              //console.log(allconnections);
              return allquestions;

            })
          );
        });
  };
  module.exports.getQuestion=  function (qID){
     return  new Promise(resolve =>{
          resolve(questionModel.find({"number":qID}).then(function(question){
            return question;
          })
        );
      });
  };

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  module.exports.addQuestion=  function (question,answer,username){
    var qid = getRandomInt(7,1000);

    var newQuestion = {"number":qid,"question":question,"answer":answer,
        "createdBy":username };
        return new Promise(resolve =>{
           resolve(questionModel.collection.insertOne(newQuestion).then(function(data){
             return data;
          })
        );
      });
  };

    module.exports.questionModel=questionModel;
