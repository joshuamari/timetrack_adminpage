//#region GLOBALS
switch (document.location.hostname) {
  case "kdt-ph":
    rootFolder = "//kdt-ph/";
    break;
  case "localhost":
    rootFolder = "//localhost/";
    break;
  default:
    rootFolder = "//kdt-ph/";
    break;
}
var devs = [464, 487];
var empDetails = [];
var permissions = [];
var count = 0;
//#endregion
checkLogin();

//#region BINDS
$(document).ready(function () {
  getEmployees();
});
$(document).on("click", "#loginBtn", function () {
  signIn();
});
$(document).on(
  "click",
  "#usernameLogin, #passwordLogin, #companyLogin",
  function () {
    $(this).val("");
    $(this).siblings("small").addClass("d-none");
    $(this).removeClass("border border-danger");
  }
);

//#endregion

//#region FUNCTIONS
function signIn() {
  var user = $("#usernameLogin").val();
  var pw = $("#passwordLogin").val();
  var company = $("#companyLogin").val();
  var remember = $("#remember").prop("checked");
  var ctr = 0;

  if (!user) {
    $("#usernameLogin").addClass("border border-danger");
    $("#usernameLogin").siblings("small").removeClass("d-none");
    ctr++;
  }

  if (!pw) {
    $("#passwordLogin").addClass("border border-danger");
    $("#passwordLogin").siblings("small").removeClass("d-none");
    ctr++;
  }
  if (!company) {
    $("#companyLogin").addClass("border border-danger");
    $("#companyLogin").siblings("small").removeClass("d-none");
    ctr++;
  }
  if (ctr > 0) {
    return;
  } else {
    $("#successModal").modal("show");
    reset();
  }
}
function reset() {
  $("#usernameLogin, #passwordLogin, #companyLogin").val("");
  $("small").addClass("d-none");
  $("#usernameLogin, #passwordLogin, #companyLogin").removeClass(
    "border border-danger"
  );
  $("#remember").prop("checked", false);
}
function checkLogin() {
  $.ajax({
    url: "Includes/checkLogin.php",
    success: function (data) {
      empDetails = $.parseJSON(data);
      if (Object.keys(empDetails).length < 1) {
        window.location.href = rootFolder + "/KDTPortalLogin";
      } else {
        if (!devs.includes(parseInt(empDetails["empNum"]))) {
          window.location.href = rootFolder + "/KDTPortalLogin";
        }
        $(`.hello-user`).text(`${empDetails["empFName"]}`);
      }
    },
    async: false,
  });
}
function getEmployees() {
  var employees = [];
  var searchWord = $("#searchWord").val();
  $("#empList").empty();
  $.post(
    "ajax/get_employees.php",
    {
      searchWord: searchWord,
    },
    function (data) {
      employees = $.parseJSON(data);
    }
  );
}
//#endregion
