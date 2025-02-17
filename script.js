function sendEmail() {
    let params = {
        email: [ 
            document.getElementById("emailInput1").value, 
            document.getElementById("emailInput2").value, 
            document.getElementById("emailInput3").value 
        ].join(','), // Combine all emails into a single string
    };

    emailjs.send("service_n7ca8z3", "template_dezj0db", params)
        .then(alert("Members Added Successfully!"));
}
