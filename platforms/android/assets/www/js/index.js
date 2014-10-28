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
		});

		$('.backBtn').on('click', function() {
			$( "#firstPage" ).removeClass( "hide" );
			$( "#firstPage" ).addClass( "show" );
			$( "#secondPage" ).removeClass( "show" );
			$( "#secondPage" ).addClass( "hide" );
			$( "#addPodcastPage" ).removeClass( "show" );
			$( "#addPodcastPage" ).addClass( "hide" );
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
	alert(podcastName);
	//alert(podcastURI);
	
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
					//alert(itemTitle);
					
					for(i = 0; i < 2; i++)
					{
						var channelTag = xmlDoc.getElementsByTagName('channel')[0];
						var itemTag = channelTag.getElementsByTagName('item')[i];
						var imageTag = channelTag.getElementsByTagName('image')[0];
						var androidFile = cordova.file.dataDirectory;
						console.log(androidFile);
						
						var itemTitle = itemTag.getElementsByTagName('title')[0].childNodes[0].nodeValue; //Holds Podcast title value
						console.log(itemTitle);
						var itemImage = imageTag.getElementsByTagName('url')[0].childNodes[0].nodeValue; //Holds Podcast image value
						console.log(itemImage);
						var itemFile = itemTag.getElementsByTagName('origEnclosureLink')[0].childNodes[0].nodeValue; //Holds Podcast MP3 value
						var encodedFile = encodeURI(itemFile);
						console.log(itemFile);
						console.log(encodedFile);
						
						//Download Podcast episode here
						var fileTransfer = new FileTransfer();
						fileTransfer.download(encodedFile, androidFile,
							function(entry) {
								console.log("download complete: " + entry.toURL());
							},
							function(error) {
								console.log("download complete: " + error.code());
							},
							true
							);
						
						alert("Podcast added!");
					}
				}           
			}       
		}   
	};
	request.send();
	
}








