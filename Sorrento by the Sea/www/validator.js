function validateForm(){
/* declaring the let variable by grabbing the details from the html file */
    let email = document.getElementById("email").value;
    let userName = document.getElementById("userName").value;
    let phone = document.getElementById("phone").value;
    let subject = document.getElementById("subject").value;

/* Checks to see if the text field has the right letters/numbers in the field */
    let emailLimit = /^[.+@.+\..+]/;
    let nameLimit = /[A-Z]/i;
    let phoneLimit = /[0-9]{10}/;
    let subjectLimit = /.+/;

    let valid = true;
/* Provides a warning message to the user if the information they provided in the field is incorrect */
    let invalidMessage = "You must enter the following information:";
    if(!emailLimit.test(email) && !phoneLimit.test(phone)){
        invalidMessage += "\n- Please provide at least one valid contact field (Phone [10 numbers] or email [example@domain.com])"
        valid = false;
    }
    if(!nameLimit.test(userName)){
        invalidMessage += "\n- Please provide a valid username (at least 2 letter characters)";
        valid = false;
    }
    if(!subjectLimit.test(subject)){
        invalidMessage += "\n- Please provide a valid message (Must not be empty)";
        valid = false;
    }
    if(!valid){
        window.alert(invalidMessage);
        return false;
    }
    else{
        return true;
    }
}