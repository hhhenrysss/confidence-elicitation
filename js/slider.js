
$( function() {
    var handle = $( "#custom-handle" );
    $( "#slider" ).slider({
        range: "min",
        value: 0,
        min: 1,
        max: 100,
        animate: true,
        create: function() {
            handle.text( $( this ).slider( "value" ) );
        },
        slide: function( event, ui ) {
            handle.text( ui.value );
        }
    });
} );