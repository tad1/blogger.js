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

    var swearWordsCensor = true;

    //Swear words to censor
    var swearWordsList = ['fuck', 'dick', 'shit', 'asshole', 'bitch', 'cunt', 'sex'];


    //Prototype
    Blogger.prototype = {

    //// Blogger.Manager    ////


    //// Blogger.Editor     ////

        //A function to add post
        AddPost: function(){

            return this;
        },

        //Function to edit post
        EditPost: function(){

            return this;
        },

        //Function to read post (from file)

        //Function to save post to file

        //Function to delete post

        //Function to change layout
        EditLayout: function(){

        },

    //// Blogger.Presenter  ////

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
          title.setAttribute("class", "logName");

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
            subTitle.setAttribute("class", "subTitle");
            content.setAttribute("class", "section");
            subTitle.innerHTML = postData.subTitle[i];
            content.innerHTML = postData.content[i];
          }

            return post;
        },

        //Function to load blog data
        LoadData: function(dataSet) {
            if(dataSet != null)
                {
                    var container = global.document.getElementsByClassName("content")[0];

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

        DataRequest: function(url) {
            var xmlhttp = new XMLHttpRequest();
            var self = this;
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var myData = JSON.parse(this.responseText);
                    self.LoadData(myData);
                    }
                };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
      },

        //Function which present post

        //Function which present website

    //// Blogger.Actions    ////

        //Creates new comment
        Comment: function(text){

        },

        //Creates new user

        //Log in user

        //Log out user

        //Filter from swear words
        Filter: function(text)
        {
            //Regex and replacement
        },


    //// Blogger.Outfit     ////

        //Function to change color palete


        //Function to change darktheme colors

        //Function to change main color

        //Function to change secondary color

        //Function to change third color

        //Function to change background color

        //Function to change link color

        //Function to change headder color

        //Function to change footer color


    //// Blogger.AddsOnes   ////



    };

    Blogger.init = function(title){
        var self = this;
        self.title = title || "Your Title Here";
    }

    Blogger.init.prototype = Blogger.prototype;

    global.Blogger = global.B$ = Blogger;

}(window));
