$(document).ready(function(){
  var screenplayHoldingArea = $('#screenplayHoldingArea');
  processWordFrequency(screenplayHoldingArea.text())

  function processWordFrequency(screenplay){
    var words = calculateWordFrequency(screenplay);
    var numberOneIndex = 0;
    var topWordsCutoffIndex = 16;
    words = words.slice(numberOneIndex, topWordsCutoffIndex);

    var svg = d3.select('#graph').append('svg')
                .attr('id', 'svg_vis');

    svg.append('rect')
       .attr('class', 'svgBackground');

    for(var stars = 0, numStars = 100; stars < numStars; stars++){
      svg.append('circle')
        .attr('class', 'stars')
        .attr('cx', randomXPosition())
        .attr('cy', randomYPosition());
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
        x: randomXPosition(),
        y: randomYPosition()
      };
      wordNodes.push(wordNode);
    })

    var circles = svg.selectAll('.wordBubble')
                    .data(wordNodes, function(node){return node.wordString;})
                    .enter()
                    .append('circle')
                    .attr('class', 'wordBubble')
                    .attr('r', function(node){ return node.radius; })
                    .attr('stroke', 'black')
                    .attr('stroke-width', 3)
                    .attr('fill', varyColorByIndex);


    var forceLayout = d3.layout.force()
                        .nodes(wordNodes)
                        .size([getSvgWidth(), getSvgHeight()])
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
                            var centerX = getCenterX();
                            var centerY = getCenterY();
                            var damper = 0.1;
                            node.x = node.x + (centerX - node.x) * (damper + 0.02) * e.alpha;
                            node.y = node.y + (centerY - node.y) * (damper + 0.02) * e.alpha;
                          })
                          .attr('cx', function(node){ return node.x; })
                          .attr('cy', function(node){ return node.y; });
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
    var startSentenceUntilWordBoundary = '[^\\.;\\?\\!-]*(\\b';
    var afterWordBoundaryUntilEndSentence = '\\b)[^\\.;\\?\\!-]*';
    var regularExpressionStr =
      startSentenceUntilWordBoundary +
      focusedWord +
      afterWordBoundaryUntilEndSentence;

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

    var lineEndings = /(\r\n|\n|\r)/gm;
    var emptyStr = '';
    randomSentenceStr = randomSentenceStr.replace(lineEndings, emptyStr);

    var multipleSpaces = /\s\s+/g;
    var singleSpace = ' ';
    randomSentenceStr = randomSentenceStr.replace(multipleSpaces, singleSpace);
    $('#randomSentenceTextArea').css('background-color', 'black');
    $('#randomSentenceTextArea').val(randomSentenceStr);
  }

  function hideRandomSentence(data, index){
    $('#randomSentenceTextArea').css('background-color', 'gray');
    $('#randomSentenceTextArea').val('Hover over a word for a random example of its usage...');
  }

  function varyColorByIndex(data, index){
    if(index % 2 === 0){
      return '#5973B2';
    } else {
      return '#394c7a';
    }
  }

  function getSvgWidth(){
    var regexNonNumerical = /[^-\d\.]/g;
    var emptyStr = '';
    var svgWidth = $('#svg_vis').css('width').replace(regexNonNumerical, emptyStr);
    return svgWidth;
  }

  function getSvgHeight(){
    var regexNonNumerical = /[^-\d\.]/g;
    var emptyStr = '';
    var svgHeight = $('#svg_vis').css('height').replace(regexNonNumerical, emptyStr);
    return svgHeight;
  }

  function randomXPosition(){
    return Math.random() * getSvgWidth();
  }

  function randomYPosition(){
    return Math.random() * getSvgHeight();
  }

  function getCenterX(){
    var svgWidth = getSvgWidth();
    return svgWidth / 2;
  }

  function getCenterY(){
    var svgHeight = getSvgHeight();
    return svgHeight / 2;
  }
});