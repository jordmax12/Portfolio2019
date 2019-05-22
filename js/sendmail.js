const isBusy = false;

$(document).ready(function() {
	$('#mailsubmit').on('click', function() {
			event.preventDefault(); // prevent default submit behaviour
			if(isBusy) return;
			isBusy = true;
			// get values from FORM
			var name = $("#name").val();
			var email = $("#email").val();
			var subject = $("#subject").val();
			var message = $("#message").val();
			var firstName = name; // For Success/Failure Message
			// Check for white space in name for Success/Fail message
			if (firstName.indexOf(' ') >= 0) {
				firstName = name.split(' ').slice(0, -1).join(' ');
			}

			$.ajax({
				url: "./mail/contact_me.php",
				type: "POST",
				data: {
					name: name,
					subject: subject,
					email: email,
					message: message
				},
				cache: false,
				success: function() {
					// Success message
					$('#success').html("<div class='alert alert-success'>");
					$('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
						.append("</button>");
					$('#success > .alert-success')
						.append("<strong>Your message has been sent. </strong>");
					$('#success > .alert-success')
						.append('</div>');

					$('#success').show();
					setTimeout(() => {
						$('#success').hide();
					}, 5000)

					//clear all fields
					$('#contactForm').trigger("reset");
					isBusy = false;
				},
				error: function(e) {
					console.log('here2', e);
					// Fail message
					$('#success').html("<div class='alert alert-danger'>");
					$('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
						.append("</button>");
					$('#success > .alert-danger').append("<strong>Sorry " + firstName + ", it seems that my mail server is not responding. Please try again later!");
					$('#success > .alert-danger').append('</div>');

					
					$('#success').show();
					setTimeout(() => {
						$('#success').hide();
					}, 5000)
					//clear all fields
					$('#contactForm').trigger("reset");
					isBusy = false;
				},
			});
	});
});