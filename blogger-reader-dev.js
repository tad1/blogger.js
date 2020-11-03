/// blogger-writer.js


    //About goals:
    //1. Fast
    //2. Easy to use
    //3. Safe
    //4. Costumisable
    //5. AddOnes

//There is a Blogger.js for creating blog
//And Blogger.js to present blog
(function(global){

    var Blogger = function(title)
    {
        return new Blogger.init(title);
    }

    var settings = {};

    var images = [];

    var uploadData = [];

    var blogData = {

    };
    var editingPostId = null;

    var userToken;


    //Prototype
    Blogger.prototype = {

    //// Blogger.Presenter  ////


        DataRequest: function(url, callback){
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var myData = xmlhttp.responseText;
                    if(callback)
                        callback(myData);
                    }
                };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        },

        //Send Data to server
        SendData: function(url, data, callback) {
          var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
          xmlhttp.open("POST", url);
          xmlhttp.setRequestHeader("Content-Type", "application/json");
          xmlhttp.onreadystatechange = function() {
              if (this.readyState == 4) {
                if(callback)
                  callback(this.responseText);
                  }
              };
          xmlhttp.send(data);
        },

        //Function to read One post
        ReadPost: function(postData, postId) {
          var create = global.document.createElement.bind(global.document);
          var post = create("div");
          var date = create("span");
          var title = create("span");

          var numberOfSections = postData.subTitle.length;

          post.appendChild(date);
          post.appendChild(title);


          //Add attributes
          post.setAttribute("id", postId);
          post.setAttribute("class", "devlog");
          date.setAttribute("class", "date");
          title.setAttribute("class", "title");

          //Add content
          date.innerHTML = postData.date;
          title.innerHTML = postData.title;

          //Add sections
          for(let i = 0; i < numberOfSections; i++)
          {
            let subTitle = create("span");
            let content = create("div");
            post.appendChild(subTitle);
            post.appendChild(content);
            subTitle.setAttribute("class", "sectionName");
            content.setAttribute("class", "section");
            subTitle.innerHTML = postData.subTitle[i];
            content.innerHTML = postData.content[i];
          }

            return post;
        },

        //Function to load blog data
        PrintData: function(dataSet) {
            if(dataSet != null)
                {
                  dataSet = JSON.parse(dataSet);
                    var container = global.document.getElementsByTagName("main")[0];

                    for(let i = 0; i < dataSet.length; i++)
                    {
                        var post = this.ReadPost(dataSet[i], i);
                        container.appendChild(post);

                    }

                }
            else{
                console.log("Error During HTTP Request!");
            }

        },

        LoadBlogData: function(data){
            if(data != null)
            {
              data = JSON.parse(data);
                //Set settings
                this.settings = data.settings;
                this.blogData = data;

                //Load
                var versionUpdate = parseInt((new Date()).getTime()/1000000);
                var create = global.document.createElement.bind(global.document);
                var title = global.document.getElementsByTagName("title")[0];
                var header = global.document.getElementsByTagName("header")[0];

                var blogName = create("h1");

                header.appendChild(blogName);

                title.innerHTML = data.title;
                blogName.innerHTML = data.name;
                this.LoadCSS.call(this, data.style);
                this.LoadCSS.call(this, "css/master.css");
                this.LoadData.call(this, data.content+"?v="+versionUpdate);
            }
            else
                console.log("No settings data")
        },

        LoadData: function(url){
            return this.DataRequest(url, this.PrintData.bind(this));
        },

        //Function which loads blog data
        LoadBlog: function(url) {
          url = "blog.json" || url;
            return this.DataRequest(url, this.LoadBlogData.bind(this))
        },

        ReloadBlog: function() {
          global.location.reload(true);
        },

        //Function to load CSS file to blog
        LoadCSS: function(cssURL){
            var head = global.document.getElementsByTagName("head")[0];

            var style = global.document.createElement("link")

            style.rel = "stylesheet";
            style.href = cssURL

            head.appendChild(style);


        },

        //Function which present post

        //Function which present website

    //// Blogger.Actions    ////

        //Creates new comment
        Comment: function(text){

        },

        //Creates new user

        //Log in user
        LogIn: function(login, password){
          //Send request for user token
          if(this.userToken == '')
          {
            if(login == 'root' && password == 'root')
              userToken = 'QWERTY1234';

            if(this.userToken != '')
              console.log("Login Successfull");
          }
          else {
            console.log("You are already loged");
          }

        },
        //Log out user
        LogOut: function(){
          if(this.userToken != '')
          {
            this.userToken= "";
            console.log("User logged out");
          }
        },
        //Filter from swear words
        Filter: function(text)
        {
            //Regex and replacement
        },



    //// Blogger.AddsOnes   ////



    };

    Blogger.init = function(title){
        var self = this;
        self.title = title || "Your Title Here";
    }

    Blogger.init.prototype = Blogger.prototype;

    global.Blogger = global.B$ = Blogger;

}(window));
