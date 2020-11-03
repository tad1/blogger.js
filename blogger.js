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

    //// Blogger.Manager    ////


    //// Blogger.Editor     ////


        //Create editor
        Editor: function(){
          //Request Editor Template
          console.log();
          this.DataRequest(this.blogData.editor_template, this.EditorOnLoad.bind(this));
        },

        EditorOnLoad: function(editor_template){
          //Reference to document
          var document = global.document;
          //Reference to createElement
          var create = document.createElement.bind(document);



          var button = create('span');
          var breaker = create('br');
          button.addEventListener("click", this.NewPostEditor.bind(this, editor_template), false)
          button.setAttribute("class", 'button');
          button.innerHTML = '+New Post';


          var firstElement;

          if(document.getElementsByClassName('devlog').length == 0){
            firstElement = document.getElementsByClassName('content')[0];
            button.innerHTML = 'Create first post!';
            button.removeAttribute('class');
            button.setAttribute('class', 'button firstPostButton');
            button.addEventListener('click', function() {
                this.remove();
            })

          }else {
            firstElement = document.getElementsByClassName('devlog')[0];
          }

          firstElement.prepend(breaker);
          firstElement.prepend(button);

          //Add Edit Button to existing posts
          var posts = document.getElementsByClassName('devlog');

          for (var i = 0; i < posts.length; i++) {
            let editBtn = create('span');
            editBtn.setAttribute('class', 'button editButton');
            editBtn.addEventListener('click' , this.EditPost.bind(this, i));
            editBtn.innerHTML = 'Edit';
            posts[i].append(editBtn);
          }

          //Add event Listeners
          global.document.addEventListener('keypress', function(event){
            if(event.key === 'Enter')
            {
              if(event.target.className.split(' ').includes('title-input'))
              {
                event.target.nextSibling.focus();
                event.preventDefault();
              }
              if(event.target.className.split(' ').includes('sectionContent'))
              {
                event.preventDefault();
                var selection = global.getSelection(),
                range = selection.getRangeAt(0),
                br = global.document.createElement("br");
                range.deleteContents();
                range.insertNode(br);
                range.setStartAfter(br);
                range.setEndAfter(br);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);

              }
            }});

            function saveTransferData(event) {
              event.preventDefault();
              if(event.target.className.split(' ').includes('sectionContent'))
              {

                if(!this.uploadData)
                  this.uploadData = [];
                this.uploadData.push(event.dataTransfer.files[0]);
                console.log(event.dataTransfer.files[0]);
                var uploadData = this.uploadData;
                //Show all images
                var image =  document.createElement('img');
                const reader = new FileReader();
                reader.addEventListener("load", function () {
                  // convert image file to base64 string
                  console.log(uploadData.length);
                  image.src = reader.result;
                  image.id = 'imageToUpload_'+(uploadData.length-1);
                  image.setAttribute('class', 'imagesToUpload') ;

                }, false);
                reader.readAsDataURL(event.dataTransfer.files[0]);

                var range=null;
                if (document.caretRangeFromPoint) { // Chrome
                  range=document.caretRangeFromPoint(event.clientX,event.clientY);
                }
                else if (event.rangeParent) { // Firefox
                  range=document.createRange(); range.setStart(event.rangeParent,event.rangeOffset);
                }
                var sel = global.getSelection();
                sel.removeAllRanges(); sel.addRange(range);
                range.insertNode(image);
                sel.removeAllRanges();
              }
            }
            global.document.addEventListener('drop', saveTransferData.bind(this));
            global.document.addEventListener('dragover', function(event) {
              event.preventDefault();
              event.stopPropagation();

            })
        },

        //Call New Post Editor
        NewPostEditor: function(editor_template){

          if(this.editingPostId != null){
              //Ask For Closing
              if(confirm('Are you sure you want to close unsaved editor instance?')){
                //Close Previus Edited
                this.CloseEditPost.apply(this);
              }
              else {
                return;
              }
            }
          this.editingPostId = -1;
          //Create New Post button
          //Add Editor
          var main = document.getElementsByClassName("content")[0];
          var editor = document.createElement("div");

          editor.innerHTML = editor_template;
          editor.setAttribute("class", "editor devlog");

          main.prepend(editor);
          this.LoadCSS("css/blogger.css");


        },

        //Formatting function
        Format: function(command, value) {
            global.document.execCommand(command, false, value);
         },

         AddSection: function(childElement) {
           var create = global.document.createElement.bind(global.document);

           var parentElement = childElement.parentElement;
           var numberOfSection = parentElement.querySelectorAll('.sectionName').length;
           var lastElement;
           if(numberOfSection > 0)
            lastElement = parentElement.querySelectorAll('.removeSectionButton')[numberOfSection-1];
          else
            lastElement = parentElement.querySelector('.title');
           var titleInput = create("div");

           var contentInput = create("div");

           lastElement.after(titleInput);
           titleInput.after(contentInput);


           titleInput.setAttribute('class', 'sectionName title-input');
           titleInput.setAttribute('contenteditable', 'true');
           titleInput.setAttribute('placeholder', 'Section Name');


           contentInput.setAttribute('class', 'sectionContent section');
           contentInput.setAttribute('contenteditable', 'true');
           contentInput.setAttribute('onclick', 'moveToolBox(this)');
           contentInput.setAttribute('placeholder', 'Content');

           //Add Remove Section button
           var removeSectionBtn = document.createElement('span');
           removeSectionBtn.setAttribute('class', 'button removeSectionButton');
           removeSectionBtn.addEventListener('click', this.RemoveSection.bind(this, titleInput));
           removeSectionBtn.innerHTML = 'remove section';
           contentInput.after(removeSectionBtn);


           titleInput.focus();
         },

         RemoveSection: function(sectionTitle) {
           if(confirm('Are you sure you want to remove this section?'))
           {
             var section = sectionTitle.nextElementSibling;
             var removeBtn = section.nextElementSibling;

             sectionTitle.remove();
             section.remove();
             removeBtn.remove();
           }
         },

        //A function to add post
        AddPost: function(postData) {
          //Get Post.json

          //
        },

        //Function to edit post
        EditPost: function(postId){
          var document = global.document;

          if(global.document.getElementsByClassName('editor').length > 0)
          {
            //Ask For Closing
            if(confirm('Are you sure you want to close unsaved editor instance?')){
              //Close Previus Edited
              this.CloseEditPost.apply(this);
            }
            else {
              return;
            }

          }
          this.editingPostId = postId;

          var document = global.document;
          var postNode = document.getElementById(postId);
          var title = postNode.querySelector('.title')
          var sectionNames = postNode.querySelectorAll('.sectionName');
          var sections = postNode.querySelectorAll('.section');
          var numberOfSections = sectionNames.length;

          //Update classes and attributes
          postNode.setAttribute('class', 'editor devlog');

          title.setAttribute('class', 'title title-input');
          title.setAttribute('contenteditable', true);

          for (var i = 0; i < sectionNames.length; i++) {
            sectionNames[i].setAttribute('class', 'editor_sectionName sectionName title-input');
            sectionNames[i].setAttribute('contenteditable', true);

            sections[i].setAttribute('class', 'sectionContent section');
            sections[i].setAttribute('contenteditable', true);

            //Add Remove Section button
            var removeSectionBtn = document.createElement('span');
            removeSectionBtn.setAttribute('class', 'button removeSectionButton');
            removeSectionBtn.addEventListener('click', this.RemoveSection.bind(this, sectionNames[i]));
            removeSectionBtn.innerHTML = 'remove section';
            sections[i].after(removeSectionBtn);

            //Add Event Listeners to input areas
            sectionNames[i].addEventListener('keypress', function(event) {
              if(event.key === 'Enter'){
                this.nextSibling.focus();
                  event.preventDefault();
                }});
          }

          //Remove editButton
          var editBtn = postNode.querySelector('.editButton');
          editBtn.remove();


          //Add New Section Button
          var newSectionButton = document.createElement('span');
          newSectionButton.setAttribute('class', 'button');
          newSectionButton.addEventListener('click', this.AddSection.bind(this, title));
          newSectionButton.innerHTML = '+New Section';
          postNode.append(newSectionButton);
          console.log(this);
          //Add Save button
          var saveBtn = document.createElement('span');
          saveBtn.setAttribute('class', 'button saveButton');
          saveBtn.setAttribute('type', 'button');
          saveBtn.addEventListener('click', this.SavePost.bind(this, postId));
          saveBtn.innerHTML = 'Save';
          newSectionButton.after(saveBtn);

          title.scrollIntoView(true);
          title.focus();

        },

        CloseEditPost: function() {
          var document = global.document;
          var postNode = document.getElementsByClassName('editor')[0];


          if(this.editingPostId == -1)
          {
            postNode.remove();
            this.editingPostId = null;
            return;
          }

          var title = postNode.querySelector('.title')
          var sectionNames = postNode.querySelectorAll('.sectionName');
          var sections = postNode.querySelectorAll('.section');
          var numberOfSections = sectionNames.length;

          postNode.setAttribute('class', 'devlog');

          title.setAttribute('class', 'title');
          title.setAttribute('contenteditable', false);

          for (var i = 0; i < sectionNames.length; i++) {
            sectionNames[i].setAttribute('class', 'sectionName');
            sectionNames[i].setAttribute('contenteditable', false);

            sections[i].setAttribute('class', 'section');
            sections[i].setAttribute('contenteditable', false);
          }

          //Remove Event Listeners to input areas
          title.removeEventListener('keypress', function(event) {
            if(event.key === 'Enter'){
                this.nextSibling.focus();
                event.preventDefault();
              }});

          //Delete Save button
          var saveBtn = postNode.querySelector('.saveButton');
          saveBtn.remove();

          //Add Edit Button
          var editBtn = document.createElement('span');
          editBtn.setAttribute('class', 'button editButton');
          editBtn.setAttribute('type', 'button');
          editBtn.addEventListener('click', this.EditPost.bind(this, this.editingPostId));
          editBtn.innerHTML = 'Edit';
          sections[numberOfSections-1].after(editBtn);

          this.editingPostId = null;


        },

        //Publish New Post
        PublishPost: function(){
          this.ContentCheck(this.UploadFiles.bind(this, this.ContentUpdate.bind(this, this.DataRequest.bind(this, this.blogData.content, this.CallbackPublishPost.bind(this)))));
        },

        CallbackPublishPost: function(postJSON) {

          if(global.document.getElementsByClassName('editor').length == 0){
            console.log("Publishing Post Error: There isn't any active editor instance.");
          }
          postJSON = JSON.parse(postJSON);
          postJSON = [] || postJSON;
          var post = {};
          var sectionNames = [];
          var content = [];

          var numberOfSections = global.document.getElementsByClassName('editor')[0].getElementsByClassName('sectionName').length;

          //Set Date
          var today = new global.Date();
          var dd = String(today.getDate()).padStart(2, '0');
          var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
          var yyyy = today.getFullYear();
          post.date = dd + '-' + mm + '-' + yyyy;

          post.title = global.document.getElementsByClassName("title")[0].innerHTML;
          for(let i = 0; i < numberOfSections; i++){
              sectionNames.push(global.document.getElementsByClassName('sectionName')[i].innerHTML);
              content.push(global.document.getElementsByClassName('section')[i].innerHTML);
          }
          post.subTitle = sectionNames;
          post.content = content;

          postJSON.push(post);
          postJSON = JSON.stringify(postJSON);
          this.SendData("savePost.php", postJSON, this.ReloadBlog);
        },


        //Function to save a post
        SavePost: function(postId){
          this.ContentCheck(this.UploadFiles.bind(this, this.ContentUpdate.bind(this, this.DataRequest.bind(this, this.blogData.content, this.CallbackSavePost.bind(this, postId)))));
        },


        CallbackSavePost: function(postId, postJSON) {
          var document = global.document;
          postJSON = JSON.parse(postJSON);

          if(this.editingPostId == null){
            console.log("Saving Error: there's not any currently editing post!");
            return;
          }
          if(document.getElementsByClassName('editor').length == 0){
            console.log("Saving Error: there's not any existing editor instance!");
            return;
          }

          var post = {};
          var sectionTitle = [];
          var section = [];
          var postElement = document.getElementsByClassName('editor')[0];
          var numberOfSection = postElement.querySelectorAll('.sectionName').length;

          post.date = postElement.querySelector('.date').innerHTML;
          post.title = postElement.querySelector('.title').innerHTML;
          for (var i = 0; i < numberOfSection; i++) {
            sectionTitle.push(postElement.querySelectorAll('.sectionName')[i].innerHTML);
            section.push(postElement.querySelectorAll('.section')[i].innerHTML);
          }
          post.subTitle = sectionTitle;
          post.content = section;

          postJSON[postId] = post;
          postJSON = JSON.stringify(postJSON);
          this.SendData("savePost.php", postJSON, this.ReloadBlog);
        },

        ContentCheck: function(callback){
          console.log("Content Check");
          var document = global.document;
          var postElement = document.getElementsByClassName('editor')[0];
          var images = postElement.querySelectorAll('.imagesToUpload');
          var uploadImages = [];
          for (var i = 0; i < images.length; i++) {
            uploadImages[i] = this.uploadData[images[i].getAttribute('id').split('_')[1]];
          }
            if(uploadImages.length > 0){
              callback('saveFiles.php',uploadImages);
              return;
            }
            console.log("There isn't any image to save");
            callback();



        },

        UploadFiles: function(callback, url, files){
          if(!url || !files){
            callback("No files to upload");
            return;
          }
          console.log("Upload Files");
          var fileNames = [];
          if(url && files){
            //Create unique filenames
            for(let i = 0; i < files.length ; i++){
              fileNames.push(Math.random().toString(36).substr(2, 9) + files[i].name);
            }

            console.log(fileNames);
          }


          var xhr = new XMLHttpRequest();
          var formData = new FormData();
          xhr.open('POST', url, true);

          xhr.addEventListener('readystatechange', function(e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
              console.log(xhr.responseText);
              callback(fileNames);
              console.log("Files Uploaded");
            }
            else if (xhr.readyState == 4 && xhr.status != 200) {
              callback(xhr.responseText);
            }
          })
          for(var i = 0; i < files.length; i++){
            formData.append('fileToUpload_'+i, files[i]);
            formData.append('fileName_'+i, fileNames[i]);
          }
          formData.append('numberOfFiles', files.length);

          console.log("Uploading Files");
          xhr.send(formData);
        },

        ContentUpdate: function(callback, fileNames){
          if(typeof(fileNames) === 'string'){
            if(fileNames === "No files to upload"){
              callback();
              return;
            }

            console.log(fileNames);
            return;
          }
          var postElement = global.document.getElementsByClassName('editor')[0];
          var images = postElement.querySelectorAll('.imagesToUpload');
          let iterator = 0;
          for (let i = 0; i < images.length; i++) {
            images[i].src = 'media/' + fileNames[i];
            images[i].removeAttribute('id');
            images[i].removeAttribute('class');
            console.log("Updating Imgs src");

          }
          callback();
        },


        //Function to read post (from file)

        //Function to save post to file

        //Function to delete post

        //Function to change layout
        EditLayout: function(){

        },

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

        LoadBlogData: function(callback, data){
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

                if(callback){
                  callback();
                }
            }
            else
                console.log("No settings data")
        },

        LoadData: function(url){
            return this.DataRequest(url, this.PrintData.bind(this));
        },

        //Function which loads blog data
        LoadBlog: function(url, callback) {
          url = "blog.json" || url;

            return this.DataRequest(url, this.LoadBlogData.bind(this, callback));
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
