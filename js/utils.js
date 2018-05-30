

// Function to read the answer csv into an array
//
//
function getTestBank(filename) {
    $.ajax({
        url: "answer/" + filename + ".csv",
        async: false,
        success: function (csvd) {
            data = $.csv.toArrays(csvd);
        },
        dataType: "text",
        complete: function () {
        }
    });
    return data[0];
}
