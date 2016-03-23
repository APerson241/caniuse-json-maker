document.addEventListener( "DOMContentLoaded", function () {
    document.getElementById( "another-link-submit" )
        .addEventListener( "click", function () {
            var url = document.getElementById( "another-link-url" ).value,
                description = document.getElementById( "another-link-description" ).value,
                statusElement = document.getElementById( "another-link-validation" );
            if ( !isValidUrl( url ) ) {
                statusElement.textContent = "Enter a valid URL!";
                return;
            } else if ( !description ) {
                statusElement.textContent = "Enter a description!";
                return;
            } else {
                statusElement.textContent = "";
            }

            var newListElement = document.createElement( "li" );
            var newLink = document.createElement( "a" );
            newLink.href = url;
            newLink.textContent = url;
            newListElement.appendChild( newLink );
            newListElement.appendChild( document.createTextNode( " " + description + " " ) );
            var newRemove = document.createElement( "span" );
            newRemove.className = "remove";
            newRemove.textContent = "(Remove)";
            newRemove.addEventListener( "click", function () {
                document.getElementById( "links" ).removeChild( newListElement );
            } );
            newListElement.appendChild( newRemove );
            document.getElementById( "links" ).appendChild( newListElement );

            document.getElementById( "another-link-url" ).value = "";
            document.getElementById( "another-link-description" ).value = "";
        } );

    // From http://stackoverflow.com/a/3975573/1757964
    function isValidUrl ( url ) {
        return /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/.test( url );
    }
} );
