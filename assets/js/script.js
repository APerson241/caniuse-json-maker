document.addEventListener( "DOMContentLoaded", function () {
    var supportData = {};

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

        var newRow = document.createElement( "tr" );
        var newTh = document.createElement( "th" );
        newTh.appendChild( document.createTextNode( version ) );
        newRow.appendChild( newTh );
        [ "y", "a", "n", "p", "u" ].forEach( function ( value ) {
            var newTd = document.createElement( "td" );
            var newButton = document.createElement( "input" );
            newButton.type = "radio";
            newButton.name = "v" + version.replace( " ", "-" );
            newButton.value = value;
            newTd.appendChild( newButton );
            newRow.appendChild( newTd );
        } );
        [ "x", "d" ].forEach( function ( value ) {
            var newTd = document.createElement( "td" );
            var newButton = document.createElement( "input" );
            newButton.type = "checkbox";
            newButton.value = value;
            newTd.appendChild( newButton );
            newRow.appendChild( newTd );
        } );
        var newFieldTd = document.createElement( "td" );
        var newField = document.createElement( "input" );
        newField.type = "text";
        newField.disabled = true;
        newFieldTd.appendChild( newField );
        newRow.appendChild( newFieldTd );
        document.getElementById( "versions" ).children[0].appendChild( newRow );
        document.getElementById( "version" ).value = "";
    } );

    function storeSupportData ( browser ) {
        var data = {};
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
                } else {
                    var inputElement = versionTd.children[0];
                    if ( ( inputElement.type === "radio" ) && !status && inputElement.checked ) {
                        status = inputElement.value;
                    } else if ( ( inputElement.type === "checkbox" ) && inputElement.checked ) {
                        statusSuffix += " " + inputElement.value;
                    }
                }
            } );
            status += statusSuffix;
            data[version] = status;
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
            var versionData = browserData[versionNumber];
            var newRow = document.createElement( "tr" );
            var newTh = document.createElement( "th" );
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
            newField.disabled = true;
            newFieldTd.appendChild( newField );
            newRow.appendChild( newFieldTd );
            document.getElementById( "versions" ).children[0].appendChild( newRow );
        }
    }

    // From http://stackoverflow.com/a/3975573/1757964
    function isValidUrl ( url ) {
        return /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/.test( url );
    }

    // Coverts a HTMLCollection to an array
    // From http://stackoverflow.com/a/222847/1757964
    function colToArray( htmlCollection ) {
        return Array.prototype.slice.call( htmlCollection );
    }

    function forEachBrowserTab( callback ) {
        var ul = document.getElementById( "select-browser" ).children[0];
        colToArray( ul.children ).forEach( callback );
    }
} );
