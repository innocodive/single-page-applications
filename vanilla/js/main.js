$(document).ready(function(){

      $.getJSON("data/source.json", function(data){

        var albumId;

// render Index Page : get the template from Index.html page and load it with JSON data then append it
        renderAlbums(data);

// ========================================================
// ========================================================
// this is what happens when you click on any album covers 
      $("a.album-cover").live("click", function(event){
        event.preventDefault();

// get album's "pid" and "album Name"
        albumId = $(this).attr("id");
        var albumUrl = $(this).attr("href");

// update the Album title
        var albumTitle = $(this).next().text();
        $("#cjb-logo").find("p").text(albumTitle);
        addHomeButton();

        renderSubalbum(data, albumId);
      });

      
// ========================================================
// ========================================================
// this is what happens when you click on any picture ======================================
      $("a.subalbum-img").live("click", function(event){
        event.preventDefault();
// get picture's "pid"
        var pictureId = $(this).attr("id");
        var pictureName = $(this).next().text();
        addHomeButton();

        renderPicture(data, albumId, pictureId);
      });
// end of the "albums" click ==============================
    }); // getJSON ends here
// end of the whole app ===================================

  function getImgUrl(imgURL){
    var imgArr = imgURL.split(".");
    var imgName = imgArr[0];
    return imgName;
  }

  function renderAlbums(data){
    var albumData = { albums : data };
    var albumTemplate = $("#albumTmpl").html();
    var albumHtml = Mustache.render(albumTemplate, albumData);

    $("#showAlbums").empty().append(albumHtml);
  }

  function renderSubalbum(data, albumId){
    var subAlbumData = { sub : data[albumId].subalbum };
    var subAlbumTemplate = $("#subAlbumTmpl").html();
    var subAlbumHtml = Mustache.render(subAlbumTemplate, subAlbumData);

    $("#showAlbums").append(subAlbumHtml);
  }

  function renderPicture(data, albumId, pictureId){
    var imgData = { img : data[albumId].subalbum[pictureId] };
    var imgTemplate = $("#imgTmpl").html();
    var imgHtml = Mustache.render(imgTemplate, imgData);

    $("#showAlbums").append(imgHtml);
  }

  function addHomeButton(){
    $("#showAlbums").empty().append("<p class='home-button'><a href='index.html'>Home</a></p>");
  }

});