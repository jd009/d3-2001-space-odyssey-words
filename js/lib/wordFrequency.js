var ignoreArray = ['and','the','to','a','of','for','as','i','with','it','is','on','that','this','can','in','be','has','if',
                   '------------------------------------------------------------------------',
                   'at', 'continued', 'THE', 'AND', '10', '65', '12', 'I', 'you', 'OF', 'was', 'IN', 'TO', 'had', 'A', 'The',
                   'have', 'they', 'he', 'but', 'we', '13', 'been', 'are', 'their', 'i\'m', '-', 'your', '14', '11', 'me',
                   '1', 'WE', '(con\'t)', 'yes', 'no', 'an', 'It', '4', 'what', 'HE', 'AT', 'They', 'it\'s', 'IT', 'or',
                   'OUT', 'But', 'so', 'He', 'WITH', 'just', 'In', 'And', 'him', 'should', 'I\'ve', 'HIS', 'my', 'BY', 'No',
                   'his', 'not', 'would', 'its', 'IS', 'any', 'one', 'will', 'them', '7', 'were', 'when', 'could', 'which',
                   'into', 'INSIDE', 'ARE', 'got', 'who', 'We', 'AS', '24', 'EXT', 'You', 'why', 'that\'s', 'SOME', '19',
                   'B20', 'It\'s', 'too', 'I\'ll', 'How', 'get', 'C12', '0020', 'our', 'well', 'all', 'about', 'do',
                   'by', 'now', 'like', 'don\'t', 'first', 'more', 'ON', 'much', 'some', 'us', '25', 'there', 'very', 'than',
                   'really', 'INTO', 'yet', 'then', 'FOR', 'since', 'around', 'Then', 'from', 'out', 'up', 'going', 'something',
                   'GOES', 'go', 'UP', 'FROM', 'down', 'might', 'these', 'THEY'];

var calculateWordFrequency = function(string){

  //var sWords = document.body.innerText.toLowerCase().trim().replace(/[,;.]/g,'').split(/[\s\/]+/g).sort();
  var sWords = string.toLowerCase().trim().replace(/[,;.]/g,'').split(/[\s\/]+/g).sort();
  var iWordsCount = sWords.length; // count w/ duplicates

  // array of words to ignore
  var ignore = ignoreArray;
  ignore = (function(){
    var o = {}; // object prop checking > in array checking
    var iCount = ignore.length;
    for (var i=0;i<iCount;i++){
      o[ignore[i]] = true;
    }
    return o;
  }());

  var counts = {}; // object for math
  for (var i=0; i<iWordsCount; i++) {
    var sWord = sWords[i];
    if (!ignore[sWord]) {
      counts[sWord] = counts[sWord] || 0;
      counts[sWord]++;
    }
  }

  var arr = []; // an array of objects to return
  for (sWord in counts) {
    arr.push({
      text: sWord,
      frequency: counts[sWord]
    });
  }

  // sort array by descending frequency | http://stackoverflow.com/a/8837505
  return arr.sort(function(a,b){
    return (a.frequency > b.frequency) ? -1 : ((a.frequency < b.frequency) ? 1 : 0);
  });

};

var printWordFrequency = function(wordsArray){
  var iWordsCount = wordsArray.length; // count w/o duplicates
  for (var i=0; i<iWordsCount; i++) {
    var word = wordsArray[i];
    if(word.frequency >= 10){
      console.log(word.frequency, word.text);
    }
  }
};
