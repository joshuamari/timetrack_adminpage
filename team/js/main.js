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
  let list = document.querySelectorAll(".navigation li");
  function activeLink() {
    list.forEach((item) => item.classList.remove("active"));
    this.classList.add("active");
  }
  list.forEach((item) => item.addEventListener("click", activeLink));

  $(".startli").click();

  getEmployees();
  showRemoveFilter();
  Charts();
  Charts2();
});

$(document).on("click", ".toggle", function () {
  $(".navigation").toggleClass("actived");
  $(".main").toggleClass("actived");
});
$(document).on("click", "#btn-closeNav", function () {
  $(".navigation").toggleClass("actived");
  $(".main").toggleClass("actived");
});
$(document).on("click", ".page-tab", function () {
  $(".page-tab").removeClass("active");
  $(this).addClass("active");
});
$(document).on("click", ".btn-removeFilter", function () {
  $(".filter").removeClass("active");
  $(this)
    .siblings()
    .find(".popup input[type='checkbox']")
    .prop("checked", false);
  $(".btn-removeFilter").css("display", "none");
});
$(document).on("click", ".filter", function () {
  var eto = $(this);

  $(this).siblings(".additional").toggleClass("visually-hidden");
});
$(document).on("click", ".bg", function () {
  $(this).parent().addClass("visually-hidden");
  updateFilter(this);
});

$(document).on("input", "#searchWord", function () {
  getEmployees();
});

$(document).on(
  "click",
  "#teamGrpSelAll, #tagGrpSelAll, #softGrpSelAll",
  function () {
    $(this)
      .closest(".grp")
      .find(".group-check input[type=checkbox]")
      .prop("checked", true);
    updateFilter(this);
  }
);
$(document).on(
  "click",
  "#teamGrpRemoveAll, #tagGrpRemoveAll, #softGrpRemoveAll",
  function () {
    $(this)
      .closest(".grp")
      .find(".group-check input[type=checkbox]")
      .prop("checked", false);
    updateFilter(this);
  }
);
$(document).on("click", "#teamMemSelAll", function () {
  $(this)
    .closest(".mem")
    .find(".mem-check input[type=checkbox]")
    .prop("checked", true);
  updateFilter(this);
});
$(document).on("click", "#teamMemRemoveAll", function () {
  $(this)
    .closest(".mem")
    .find(".mem-check input[type=checkbox]")
    .prop("checked", false);
  updateFilter(this);
});
$(document).on("click", ".team-tab .form-check", function () {
  var check = $(this).find("input[type=checkbox]");

  if (check.is(":checked")) {
    check.prop("checked", false);
  } else {
    check.prop("checked", true);
  }
  updateFilter(this);
});
$(document).on("change", ".popup input[type='checkbox']", function () {
  updateFilter(this);
});

//#endregion

//#region FUNCTIONS
function updateFilter(dis) {
  count = 0;
  $(dis)
    .closest(".filter-item")
    .find('.popup input[type="checkbox"]')
    .each(function () {
      if ($(this).prop("checked")) {
        count++;
      }
      if (count > 0) {
        $(this).closest(".filter-item").find(".filter").addClass("active");
      } else {
        $(this).closest(".filter-item").find(".filter").removeClass("active");
      }
    });
  showRemoveFilter();
}
function showRemoveFilter() {
  var fil = 0;
  $(".filters")
    .find(".filter-item .filter")
    .each(function () {
      if ($(this).hasClass("active")) {
        fil++;
      }
      console.log(this);
    });

  if (fil > 0) {
    $(".btn-removeFilter").css("display", "flex");
  } else {
    $(".btn-removeFilter").css("display", "none");
  }
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
      employees.map(fillEmployees);
    }
  );
}
function fillEmployees(empDeets) {
  var emp_id = empDeets["emp_id"];
  var emp_name = empDeets["emp_name"];
  var projs = empDeets["projs"];
  var projData = getBadges(projs);
  var addString = `
  <tr trid='${emp_id}'>
  <td>${emp_id}</td>
  <td>${emp_name}</td>
  <td class='apps'>
  ${projData}
  </td>
  <td class="d-flex gap-1">
                      <button class="btn btn-view" title="view">
                        <i class="bx bxs-folder-open"></i>
                      </button>
                    </td>
  </tr>`;
  $("#empList").append(addString);
}
function getBadges(projArray) {
  var addString = ``;
  Object.keys(projArray).forEach((proj) => {
    const myClass = projArray[proj];
    addString += `<span class="badge ${myClass}-badge">${proj}</span>`;
  });
  return addString;
}
function getProjects() {
  $(".app-items").empty();
  $.ajax({
    url: "ajax/get_projects.php",
    success: function (response) {
      permissions = $.parseJSON(response);
      fillProjects();
    },
  });
}
function fillProjects() {
  var addString = "";
  Object.keys(permissions).forEach((proj) => {
    const projName = permissions[proj]["project_name"];
    addString += `<li class="app-item" mod-id="${proj}">${projName}</li>`;
  });
  $(".app-items").html(`${addString}`);
}
function viewModules(projID) {
  $(".permission-items").empty();
  var addString = "";
  const filteredData = permissions[projID].modules;
  Object.keys(filteredData).forEach((outerKey) => {
    const innerObject = filteredData[outerKey];
    addString += `<div class="permission-item my-3">
    <span class="title mb-1">${outerKey} Module</span>`;

    Object.keys(innerObject).forEach((innerKey) => {
      const innerValue = innerObject[innerKey];
      addString += `<div class="form-check">
      <input
        class="form-check-input"
        type="checkbox"
        value=""
        perm-id="${innerKey}"
      />
      <label class="form-check-label" for="flexCheckDefault">
        ${innerValue}
      </label></div>`;
    });
    addString += `</div>`;
  });
  $(".permission-items").html(addString);
}
function getPermissions(projID) {
  var empID = $("#empIDPermission").val();
  $.post(
    "ajax/get_permissions.php",
    {
      projID: projID,
      empID: empID,
    },
    function (data) {
      var perms = $.parseJSON(data);
      perms.forEach(function (projectId) {
        $(`.form-check input[type="checkbox"][perm-id="${projectId}"]`).prop(
          "checked",
          true
        );
      });
    }
  );
}
function savePermissions() {
  var projID = $(".app-item.active").attr("mod-id");
  var empID = $("#empIDPermission").val();
  var perm = [];
  $(".form-check-input:checked").each(function () {
    perm.push(parseInt($(this).attr("perm-id")));
  });
  $.post(
    "ajax/save_permissions.php",
    {
      empID: empID,
      projID: projID,
      perm: perm,
    },
    function (data) {
      if ($.parseJSON(data)) {
        alert(`Save failed: ${data}`);
      }
      getPermissions(projID);
      getEmployees();
    }
  );
}

function Charts() {
  const ctx = document.getElementById("myChart");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Seven days a week",
      ],
      datasets: [
        {
          label: "# of Votes",
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1,
          backgroundColor: [
            "#586ab3",
            // "#ff6384",
            // "#36a2eb",
            // "#ffcd56",
            // "#4bc0c0",
            // "#9966ff",
            // "#ff9f40",
          ],
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      layout: {},
      maintainAspectRatio: false,
    },
  });
}

function Charts2() {
  const data = {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        label: "My First Dataset",
        data: [300, 50, 100],
        backgroundColor: [
          "#7286D3",
          "#92B4EC",
          "#FFE69A",

          // "rgb(255, 99, 132)",
          // "rgb(54, 162, 235)",
          // "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  };
  const config = {
    type: "doughnut",
    data: data,
  };
  const chart2 = new Chart(document.getElementById("myChart2"), config);
}

//#endregion
