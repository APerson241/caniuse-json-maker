document.addEventListener( "DOMContentLoaded", function () {
    var supportData = {};

    // Event listeners
    // -------------------------------------------

    document.getElementById( "another-link-submit" ).addEventListener( "click", function () {
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
        var newSpan = document.createElement( "span" );
        newSpan.appendChild( document.createTextNode( " " + description + " " ) );
        newListElement.appendChild( newSpan );
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

    // Add click handlers to the browser selection LI elements
    forEachBrowserTab( function ( element ) {
        element.addEventListener( "click", function ( event ) {
            var formerBrowser = document.getElementsByClassName( "selected" )[0].id.replace( "select-", "" ),
                currentBrowser = event.currentTarget.id.replace( "select-", "" );
            document.getElementsByClassName( "selected" )[0].className = "";
            element.className = "selected";
            storeSupportData( formerBrowser );
            clearSupportData();
            loadSupportData( currentBrowser );
        } );
    } );

    document.getElementById( "add-version-button" ).addEventListener( "click", function () {
        var version = document.getElementById( "version" ).value;

        if ( !/[\d\.]+/.test( version ) ) {
            document.getElementById( "version" ).value = "";
            return;
        }

        createNewRow( version, "" );
        document.getElementById( "version" ).value = "";
    } );

    document.getElementById( "generate" ).addEventListener( "click", function () {
        var data = {};

        [
            "title", "description", "spec", "notes", "ucprefix", "parent",
            "ie_id", "chrome_id", "firefox_id", "safari_id", "keywords"
        ].forEach( function ( property ) {
            data[property] = document.getElementById( property ).value;
        } );

        colToArray( document.getElementsByName( "status" ) ).forEach( function ( checkbox ) {
            if ( checkbox.checked ) {
                data.status = checkbox.value;
            }
        } );

        var links = [];
        colToArray( document.getElementById( "links" ).children ).forEach( function ( listElement ) {
            var newLink = {};
            colToArray( listElement.children ).forEach( function ( child ) {
                switch ( child.tagName ) {
                case "A":
                    newLink.url = child.href;
                    break;
                case "SPAN":
                    if ( child.innnerHTML !== "(Remove)" ) {
                        newLink.title = child.innerHTML.trim();
                    }
                    break;
                }
            } );
        } );
        data.links = links;

        if ( document.getElementById( "bugs" ).value ) {
            data.bugs = document.getElementById( "bugs" ).value.split( "\n" );
        }

        var categories = [];
        colToArray( document.getElementsByName( "categories" ) ).forEach( function ( categoryElement ) {
            if ( categoryElement.checked ) {
                categories.push( categoryElement.value );
            }
        } );

        data.categories = categories;
        data.stats = supportData;
        data.shown = document.getElementById( "shown" ).checked;

        data.notes_by_num = {};
        document.getElementById( "support-notes" ).value.split( /\r|\r\n|\n/ ).forEach( function ( note, index ) {
            data.notes_by_num[index + 1] = note;
        } );

        document.getElementById( "file" ).innerHTML = JSON.stringify( data, null, 2 );
    } );

    document.getElementById( "support-notes" ).addEventListener( "keyup", function () {
        var notesText = document.getElementById( "support-notes" ).value
        var lineCount = notesText ? notesText.split( /\r|\r\n|\n/ ).length : 0;
        document.getElementById( "support-notes-status" ).innerHTML = lineCount +
            " note" + ( lineCount === 1 ? "" : "s" ) + " entered.";
    } );

    document.body.addEventListener( "click", function ( event ) {
        storeSupportData();
    } );

    // Support data functions
    // -------------------------------------------

    function storeSupportData ( browser ) {
        var data = {};
        if ( typeof browser === "undefined" ) {
            browser = document.getElementsByClassName( "selected" )[0].id.replace( "select-", "" );
        }
        colToArray( document.getElementById( "versions" ).children[0].children ).forEach( function ( versionTr ) {
            if ( versionTr.children[0].textContent === "Version" ) {
                return;
            }

            var version = "",
                status = "",
                statusSuffix = "";
            colToArray( versionTr.children ).forEach( function ( versionTd ) {
                if ( versionTd.tagName === "TH" ) {
                    version = versionTd.textContent;
                } else if ( versionTd.children[0] ) {
                    var inputElement = versionTd.children[0];
                    if ( ( inputElement.type === "radio" ) && !status && inputElement.checked ) {
                        status = inputElement.value;
                    } else if ( ( inputElement.type === "checkbox" ) && inputElement.checked ) {
                        statusSuffix += " " + inputElement.value;
                    } else if ( inputElement.type === "text" ) {
                        statusSuffix += " " + inputElement.value;
                    }
                }
            } );
            status += statusSuffix.replace( "  ", " " );
            data[version] = status.trim();
        } );
        supportData[browser] = data;
    }

    function clearSupportData () {
        var tbody = document.getElementById( "versions" ).children[0];
        while( tbody.childElementCount > 1 ) {
            tbody.removeChild( tbody.lastElementChild );
        }
    }

    function loadSupportData ( browser ) {
        var tbody = document.getElementById( "versions" ).children[0],
            browserData = supportData[browser];
        clearSupportData();
        for ( var versionNumber in browserData ) {
            createNewRow( versionNumber, browserData[versionNumber] );
        }
    }

    function createNewRow ( versionNumber, versionData ) {
        var newRow = document.createElement( "tr" );
        var newTh = document.createElement( "th" );
        newTh.className = "version-cell";
        newTh.appendChild( document.createTextNode( versionNumber ) );
        newRow.appendChild( newTh );
        [ "y", "a", "n", "p", "u" ].forEach( function ( value ) {
            var newTd = document.createElement( "td" );
            var newButton = document.createElement( "input" );
            newButton.type = "radio";
            newButton.name = "v" + versionNumber.replace( " ", "-" );
            newButton.value = value;
            newButton.checked = versionData.indexOf( value ) !== -1;
            newTd.appendChild( newButton );
            newRow.appendChild( newTd );
        } );
        [ "x", "d" ].forEach( function ( value ) {
            var newTd = document.createElement( "td" );
            var newButton = document.createElement( "input" );
            newButton.type = "checkbox";
            newButton.value = value;
            newButton.checked = versionData.indexOf( value ) !== -1;
            newTd.appendChild( newButton );
            newRow.appendChild( newTd );
        } );
        var newFieldTd = document.createElement( "td" );
        var newField = document.createElement( "input" );
        newField.type = "text";
        newField.value = allMatches( /#\d+/g, versionData )
            .reduce( function ( x, y ) { return x + " " + y; }, "" )
            .trim();
        newFieldTd.appendChild( newField );
        newRow.appendChild( newFieldTd );
        var newDelete = document.createElement( "td" );
        newDelete.className = "delete";
        newDelete.innerHTML = "&times;";
        newDelete.addEventListener( "click", function () {
            this.parentElement.parentElement.removeChild( this.parentElement );
            storeSupportData();
        } );
        newRow.appendChild( newDelete );
        document.getElementById( "versions" ).children[0].appendChild( newRow );
    }

    // Other utility functions
    // -------------------------------------------

    // From http://stackoverflow.com/a/3975573/1757964
    function isValidUrl ( url ) {
        return /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/.test( url );
    }

    // Coverts a HTMLCollection to an array
    // From http://stackoverflow.com/a/222847/1757964
    function colToArray ( htmlCollection ) {
        return Array.prototype.slice.call( htmlCollection );
    }

    function forEachBrowserTab ( callback ) {
        var ul = document.getElementById( "select-browser" ).children[0];
        colToArray( ul.children ).forEach( callback );
    }

    // From http://stackoverflow.com/a/6323598/1757964
    function allMatches ( regex, string ) {
        var matches = [],
            match;
        do {
            match = regex.exec( string );
            if ( match ) {
                matches.push( match );
            }
        } while ( match );
        return matches;
    }
} );
