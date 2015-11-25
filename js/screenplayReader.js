$(document).ready(function(){
  var fileInput = $('#fileInput');
  var screenplayHoldingArea = $('#screenplayHoldingArea');
  processScreenplay(screenplayHoldingArea.text())

  function processScreenplay(string){
    var words = calculateWordFrequency(string);
    var l = words.length;
    printWordFrequency(words);
    words = words.slice(0, 16);

    var width = 1125;
    var height = 500;

    var svg = d3.select("#graph").append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("id", "svg_vis");

    svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "black");

    for(var i = 0; i < 100; i++){
      svg.append('circle')
        .attr('r', '1')
        .attr('cx', Math.random() * width)
        .attr('cy', Math.random() * height)
        .attr('fill', 'white');
    }

    var maxFrequency = d3.max(words, function(word){ return word.frequency; });
    var minFrequency = d3.min(words, function(word){ return word.frequency; });
    var radiusScale = d3.scale.sqrt().domain([minFrequency, maxFrequency]).range([10, 70]);

    var wordNodes = [];

    words.forEach(function(word){
      var wordNode = {
        wordString: word.text,
        radius: radiusScale(word.frequency),
        frequency: word.frequency,
        x: Math.random() * width,
        y: Math.random() * height
      };
      wordNodes.push(wordNode);
    })

    var circles = svg.selectAll(".wordBubble")
                    .data(wordNodes, function(node){return node.wordString;});

    circles.enter().append("circle")
      .attr('class', 'wordBubble')
      .attr("r", function(node){ return node.radius; })
      .attr("stroke", "black")
      .attr("stroke-width", 3)
      .attr("fill", function(node, index){
                      if(index % 2 === 0){
                        return "#5973B2";
                      } else {
                        return "#394c7a";
                      }
                    });

    var forceLayout = d3.layout.force()
                        .nodes(wordNodes)
                        .size([width, height])
                        .gravity(0.001)
                        .charge(function(node){
                          var radius = radiusScale(node.frequency);
                          var computedCharge = -Math.pow(radius, 1.7);
                          return computedCharge;})
                        .chargeDistance(500)
                        .friction(0.9)
                        .alpha(0.0001)
                        .on('tick', function(e){
                          circles.each(function(node, i){
                            var centerX = width / 2;
                            var centerY = height / 2;
                            var damper = 0.1;
                            node.x = node.x + (centerX - node.x) * (damper + 0.02) * e.alpha;
                            node.y = node.y + (centerY - node.y) * (damper + 0.02) * e.alpha;
                          })
                          .attr("cx", function(node){ return node.x; })
                          .attr("cy", function(node){ return node.y; });
                        });

    forceLayout.on('end', function(){
      wordNodes.forEach(function(node){
        var testing = node;
        svg.append('text')
          .text(node.wordString + ': ' + String(node.frequency))
          .attr('class', 'label')
          .attr('data-text', node.wordString)
          .attr('x', node.x)
          .attr('y', node.y)
          .attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .on('mouseover', function(){showRandomSentence(this);})
          .on('mouseleave', hideRandomSentence);
      });

      $('#randomSentenceTextArea').val('Hover over a word for a random example of its usage...');
    });

    forceLayout.start();
  }

  function showRandomSentence(element, data, index){
    var focusedWord = element.getAttribute('data-text');
    var regularExpressionStr =
      '[^\\.;\\?\\!-]*(\\b' +
      focusedWord +
      '\\b)[^\\.;\\?\\!-]*';

    var regex = new RegExp(regularExpressionStr, 'gi');
    var screenplay = $('#screenplayHoldingArea').text();
    var matches = [];
    var match = regex.exec(screenplay);
    while(match !== null){
        matches.push(match[0]);
        match = regex.exec(screenplay);
    }

    var randomIndex = Math.floor(Math.random()*matches.length);
    var randomSentenceStr = matches[randomIndex];
    randomSentenceStr = randomSentenceStr.replace(/(\r\n|\n|\r)/gm,"");
    randomSentenceStr = randomSentenceStr.replace(/\s\s+/g, ' ');
    $('#randomSentenceTextArea').css('background-color', 'black');
    $('#randomSentenceTextArea').val(randomSentenceStr);
  }

  function hideRandomSentence(data, index){
    $('#randomSentenceTextArea').css('background-color', 'gray');
    $('#randomSentenceTextArea').val('Hover over a word for a random example of its usage...');
  }
//https://www.palantir.net/2001/script.html
//http://iamnotagoodartist.com/web/quick-and-dirty-word-frequency-analysis-with-javascript/
//https://gist.github.com/rocktronica/2625413#file-wordfrequency-js
});