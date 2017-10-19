window.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');
  if(form==undefined)
    regEvent(document.getElementById('registerForm'))
  else
    LoginEvent(form);


  function LoginEvent(form) {
      form.onsubmit = function(event) {
          event.preventDefault();

          fetch("/login", {
              method: "POST",
              credentials: "include", // "omit" by default, for cookies to work
              body: new FormData(this)
          })
              .then(response => response.json())
              .then(response => {
                  if (response.error) {
                      alert(response.error.message);
                  } else if (response.user) {
                      alert("Welcome, " + response.user.displayName);
                      window.location.reload(true);
                  } else {
                      throw new Error("Invalid response from the server");
                  }
              })
              .catch(function(err) {
                  alert("Error: " + err.message);
              });
      }
  };

  function regEvent(form) {
    form.onsubmit=function (event) {
      event.preventDefault();
      if(form.password1.value!=form.password2.value){
          alert("Error"+'Пароли не совпадают!');
          return
      }

      fetch("/registrate",{
          method: "POST",
          credentials: "include", // "omit" by default, for cookies to work
          body: new FormData(this)
      })
          .then(response=>{
            if(response.error){
              alert(response.error);
            }
            else{
              alert('Поздравляю, вы зарегестрировались!');
                document.location.replace('http://localhost:3000/');
            }

          })
          .catch(function(err) {
              alert("Error: " + err.message);
          });

  };


}
});
