/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
	
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		
		$( "#firstPage" ).addClass( "show" );
		$( "#secondPage" ).addClass( "hide" );
		$( "#addPodcastPage" ).addClass( "hide" );

		$('.podcastLi').on('click', function() {
			$( "#firstPage" ).removeClass( "show" );
			$( "#firstPage" ).addClass( "hide" );
			$( "#secondPage" ).removeClass( "hide" );
			$( "#secondPage" ).addClass( "show" );
			$( "#addPodcastPage" ).removeClass( "show" );
			$( "#addPodcastPage" ).addClass( "hide" );
			
			playPodcast();
		});
		
		$('.backBtn').on('click', function() {
			$( "#firstPage" ).removeClass( "hide" );
			$( "#firstPage" ).addClass( "show" );
			$( "#secondPage" ).removeClass( "show" );
			$( "#secondPage" ).addClass( "hide" );
			$( "#addPodcastPage" ).removeClass( "show" );
			$( "#addPodcastPage" ).addClass( "hide" );
			
			document.getElementById("podcastTitle").innerHTML = "";
			document.getElementById("podcastImg").innerHTML = "";
			document.getElementById("progressBarDiv").innerHTML = "";
			
			loadCastList();
		});
		
		$('#addBtn').on('click', function() {
			$( "#addPodcastPage" ).removeClass( "hide" );
			$( "#addPodcastPage" ).addClass( "show" );
			$( "#firstPage" ).removeClass( "show" );
			$( "#firstPage" ).addClass( "hide" );
			$( "#secondPage" ).removeClass( "show" );
			$( "#secondPage" ).addClass( "hide" );
		});
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //app.receivedEvent('deviceready');
		loadCastList();
    },
    // Update DOM on a Received Event
    
};

app.initialize();

document.getElementById("addPodcastBtn").addEventListener("click", function(){
	var podcastName = document.getElementById('name').value;
	var podcastURI = document.getElementById('url').value;
	
	if(podcastName == "") 
	{
		alert("Please Enter a Name for Your Podcast.");
	} 
	else if(podcastURI == "")
	{
		alert("Please Enter a URL for Your Podcast.");
	} 
	else
	{
		document.getElementById('name').value = "";
		document.getElementById('url').value = "";
		addPodcast(podcastName, podcastURI);
	}
});

function addPodcast(podcastName, podcastURI) {
	var networkState = navigator.connection.type;
	
	if(networkState === Connection.NONE) {
		alert("Oh no! You don't have a data connection.");
	} else {
		var request = new XMLHttpRequest();
		
		request.open("GET", podcastURI, true);
		
		request.onreadystatechange = function() {       
			if (request.readyState == 4) {           
				if (request.status == 200 || request.status == 0) {               
					//console.log(request.responseText);
					if (window.DOMParser)
					{
						parser=new DOMParser();
						xmlDoc=parser.parseFromString(request.responseText,"text/xml");
						console.log(xmlDoc);
						var channelTag //= xmlDoc.getElementsByTagName('channel')[0];
						var itemTag //= channelTag.getElementsByTagName('item')[0];
						var itemTitle //= itemTag.getElementsByTagName('title')[0].childNodes[0].nodeValue;
						var retrievedData = localStorage.getItem("podcasts");
						var podcastData = JSON.parse(retrievedData);
						
						for(i = 0; i < 2; i++)
						{
							var channelTag = xmlDoc.getElementsByTagName('channel')[0];
							var itemTag = channelTag.getElementsByTagName('item')[i];
							var imageTag = channelTag.getElementsByTagName('image')[0];
							
							var itemTitle = itemTag.getElementsByTagName('title')[0].childNodes[0].nodeValue; //Holds Podcast title value
							console.log(itemTitle);
							var itemImage = imageTag.getElementsByTagName('url')[0].childNodes[0].nodeValue; //Holds Podcast image value
							console.log(itemImage);
							var itemFile = itemTag.getElementsByTagName('origEnclosureLink')[0].childNodes[0].nodeValue; //Holds Podcast MP3 value
							
							var encodedFile = encodeURI(itemFile);
							console.log(itemFile);
							console.log(encodedFile);
							
							//Download Podcast episode here
							var androidFile = cordova.file.dataDirectory;
							var addFileName = encodedFile.split('/');
							console.log(addFileName[4]);
							
							var fileTransfer = new FileTransfer();
							fileTransfer.download(encodedFile, androidFile + addFileName[4],
								function(entry) {
									console.log("download complete: " + entry.toURL());
									alert("Download for " + entry.toURL() + " complete!");
								},
								function(error) {
									console.log("download complete: " + error.code());
								},
								true
							);
							
							if (localStorage.getItem("podcasts") === null) {
								var podcasts = [];
								podcasts.push({title: itemTitle , image: itemImage , url: itemFile });
								localStorage.setItem('podcasts', JSON.stringify(podcasts));
								console.log(localStorage.getItem('podcasts'));
							} else {
								var podcasts = JSON.parse(localStorage.getItem('podcasts') || []);
								podcasts.push({title: itemTitle , image: itemImage , url: itemFile });
								localStorage.setItem('podcasts', JSON.stringify(podcasts));
								console.log(localStorage.getItem('podcasts'));
							}
							
							alert("Podcast has begun downloading!");
						}
						
						
					}           
				}       
			}   
		};
		request.send();
	}
	
	
	
}

function loadCastList() {
	document.getElementById("podcastUl").innerHTML = "";
	
	if(localStorage.getItem("podcasts") === null) {
		alert("You have no saved podcasts!");
	} else {
		var retrievedData = localStorage.getItem("podcasts");
		var podcastData = JSON.parse(retrievedData);
		
		for(i = 0; i < podcastData.length; i++) {
			var podcastTitle = podcastData[i].title;
			var podcastURL = podcastData[i].url;
			var splitURL = podcastURL.split('/');
			var podcastID = splitURL[4];
			
			document.getElementById("podcastUl").innerHTML += '<li id="' + podcastID + '" class="podcastLi table-view-cell">'+ podcastTitle + '<a class="icon icon-right pull-right"></a></li>';
		}
	}
	
	addListEvents();
}

function addListEvents() {
	$('.podcastLi').on('click', function() {
			$( "#firstPage" ).removeClass( "show" );
			$( "#firstPage" ).addClass( "hide" );
			$( "#secondPage" ).removeClass( "hide" );
			$( "#secondPage" ).addClass( "show" );
			$( "#addPodcastPage" ).removeClass( "show" );
			$( "#addPodcastPage" ).addClass( "hide" );
			
			playPodcast(this.id);
		});
}

function playPodcast(listID){
	var retrievedData = localStorage.getItem("podcasts");
	var podcastData = JSON.parse(retrievedData);
	var itemID = listID;
	var mediaURL;
	var media;
	
	for(i = 0; i < podcastData.length; i++) {
		var podcastURL = podcastData[i].url;
		var splitURL = podcastURL.split('/');
		var podcastID = splitURL[4];
	
		if(itemID === podcastID) {
			var podcastTitle = podcastData[i].title;
			var podcastImgSrc = podcastData[i].image;
		}
	}
	
	window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dirEntry) {
		var reader = dirEntry.createReader();
		reader.readEntries(function(entries) {
			for(var i = 0; i < entries.length; i++) {
      			var entry = entries[i];
      			if (entry.isFile){
        			var myURL = entry.fullPath;
					var addFileName = myURL.split('/');
					if(addFileName[1] === itemID) {
						var podcastMedia = (cordova.file.dataDirectory + addFileName[1]);
						mediaURL = podcastMedia;
						media = new Media(mediaURL,
	
							function () {
								console.log("playAudio():Audio Success");
							},
							function (err) {
								console.log("playAudio():Audio Error: " + err);
							}
						);
						media.setVolume(1);
					}
      			}
    		}
		});
	});
	
	$('#podcastTitle').append("<p>" + podcastTitle + "</p>");
	
	$('#podcastImg').prepend('<img id="podcastImage" src="' + podcastImgSrc + '" />');
	
	$('#progressBarDiv').append("<div id='progressbar'><div id='progress'></div></div>");
	
	var mediaTimer = setInterval(function () {
		media.getCurrentPosition(
			function (position) {
				if (position > -1) {
					$("#progress").width( position );
				}
			},
			function (e) {
				console.log("Error getting pos=" + e);
			}
		);
	}, 1000);
	
	$('#backBTN').on('click', function() {
		media.stop();
		media.release();
	});
  
	$('#pauseBtn').on('click', function() {
		media.pause();
	});
	
	$('#back10Sec').on('click', function() {
		media.getCurrentPosition(
			function (position) {
				if(position > 10){
					media.seekTo(position * 1000 - 10000);
				}else{
					media.seekTo(0);
				}
			}
		);
	});
	
	$('#forward30Sec').on('click', function() {
		media.getCurrentPosition(
			function (position) {
					media.seekTo(position * 1000 + 30000);
			}
		);
	});
	
	$('#playBtn').off('click'); //remove listener for play button to prevent two casts from playing over each other.
	$('#playBtn').on('click', function() {
		media.setVolume(1);
		media.play();
	});
	
	$( "#slider-fill" ).bind( "change", function(event, ui) {
		var sliderVal = ($("#slider-fill").val());
		media.setVolume(sliderVal / 100);
	});
	
	$("#deletePodcastBtn").off("click"); //remove event from delete to prevent from delete multiple epsiodes 
	$("#deletePodcastBtn").on("click", function() {
			window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dirEntry) {
			var reader = dirEntry.createReader();
				reader.readEntries(function(entries) {
					for(var i = 0; i < entries.length; i++) {
						var entry = entries[i];
						if (entry.isFile){
							var myURL = entry.fullPath;
							var addFileName = myURL.split('/');
							if(addFileName[1] === itemID) {
								entry.remove(function success() {
									console.log("file removed");
								}, function fail() {
									console.log("file remains intact");
								});
							}
						}
					}
				});
			});
		
		for(i = 0; i < podcastData.length; i++) {	
			var podcastURL = podcastData[i].url;
			var splitURL = podcastURL.split('/');
			var podcastID = splitURL[4];
		
			if(itemID === podcastID) { 
				podcastData.splice(i,1);
				localStorage["podcasts"] = JSON.stringify(podcastData);
				alert("Podcast Deleted");
				$( "#firstPage" ).removeClass( "hide" );
				$( "#firstPage" ).addClass( "show" );
				$( "#secondPage" ).removeClass( "show" );
				$( "#secondPage" ).addClass( "hide" );
				$( "#addPodcastPage" ).removeClass( "show" );
				$( "#addPodcastPage" ).addClass( "hide" );
				
				document.getElementById("podcastTitle").innerHTML = "";
				document.getElementById("podcastImg").innerHTML = "";
				document.getElementById("progressBarDiv").innerHTML = "";
				
				loadCastList();
				if(podcastData.length === 0) {
					localStorage.removeItem("podcasts");
				}
			}
		}
	});
}








