const navMenu = document.querySelector(".nav-menu");
const humberger = document.querySelector(".humberger");
humberger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  humberger.classList.toggle("active");
});
let regForm = document.querySelector(".register-form");
let allBtn = regForm.querySelectorAll("button");
let allInput = regForm.querySelectorAll("input");
let closeBtn = document.querySelector(".btn-close");
let tableBody = document.querySelector(".tbody");
let addBtn = document.querySelector(".add-btn");
let mycustom = document.querySelector(".custom");
let mycustombtn = document.querySelector(".custom-btn");
let searchEl = document.querySelector(".search");
let deleteAllBtn = document.querySelector(".delete-all-btn");
let paginationBox = document.querySelector(".pagination-box");
let prevBtn = document.querySelector(".prev-btn");
let nextBtn = document.querySelector(".next-btn");
let allRegData = [];
let url = "";
addBtn.addEventListener("click", () => {
  document.querySelector(".registration-form").classList.add("regShowForm");
});
document.querySelector(".btn-close").addEventListener("click", () => {
  document.querySelector(".registration-form").classList.remove("regShowForm");
});
if (localStorage.getItem("allRegData") != null) {
  allRegData = JSON.parse(localStorage.getItem("allRegData"));
}
//Adding Data
regForm.onsubmit = (e) => {
  e.preventDefault();
  let checkEmail = allRegData.find((data) => data.email == allInput[1].value);
  if (checkEmail == undefined) {
    allRegData.push({
      name: allInput[0].value,
      email: allInput[1].value,
      mobile: allInput[2].value,
      dob: allInput[3].value,
      password: allInput[4].value,
      profile: url == "" ? "../images/ic_logo.png" : url,
    });
    localStorage.setItem("allRegData", JSON.stringify(allRegData));
    swal("Data Inserted", "Successfully !", "success");
    closeBtn.click();
    regForm.reset();
    getUserData(0, 5);
  } else {
    swal("Email already exists", "failed", "warning");
  }
};
const getUserData = (from, to) => {
  tableBody.innerHTML = "";
  let filter = allRegData.slice(from, to);

  filter.map((data, index) => {
    let dataStr = JSON.stringify(data);
    let finalData = dataStr.replace(/"/g, "'");

    tableBody.innerHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>
                <img
                src="${data.profile}"
                width="30"
                alt="profile"
                />
            </td>
            <td>${data.name}</td>
            <td>${data.email}</td>
            <td>${data.mobile}</td>
            <td>${data.dob}</td>
            <td>
                <button data="${finalData}" index="${index}" class="edit-btn">
                <i class="fa fa-edit"></i>
                </button>
                <button index="${index}" class="del-btn">
                <i class="fa fa-trash"></i>
                </button>
            </td>
            </tr>

        `;
  });
  Action();
};
//Delete UserData
const Action = () => {
  //Delete Coding
  let allDelBtn = tableBody.querySelectorAll(".del-btn");
  //   console.log(allDelBtn);
  for (let btn of allDelBtn) {
    btn.onclick = async () => {
      let isConfirm = await confirm();
      if (isConfirm) {
        let index = btn.getAttribute("index");
        allRegData.splice(index, 1);
        localStorage.setItem("allRegData", JSON.stringify(allRegData));
        getUserData();
      }
    };
  }
  //update Coding
  let allEditBtn = tableBody.querySelectorAll(".edit-btn");
  for (let btn of allEditBtn) {
    btn.onclick = () => {
      let index = btn.getAttribute("index");
      let dataStr = btn.getAttribute("data");
      let finalData = dataStr.replace(/'/g, '"');
      let data = JSON.parse(finalData);
      addBtn.click();
      mycustom.innerHTML = "Update User";
      allInput[0].value = data.name;
      allInput[1].value = data.email;
      allInput[2].value = data.mobile;
      allInput[3].value = data.dob;
      allInput[4].value = data.password;
      url = data.profile;
      allBtn[0].disabled = false;
      allBtn[1].disabled = true;
      mycustombtn.onclick = () => {
        regForm.reset();
        mycustom.innerHTML = "Add New User";
      };
      allBtn[0].onclick = () => {
        allRegData[index] = {
          name: allInput[0].value,
          email: allInput[1].value,
          mobile: allInput[2].value,
          dob: allInput[3].value,
          password: allInput[4].value,
          profile: url == "" ? "../image/pic.JPG" : url,
        };
        localStorage.setItem("allRegData", JSON.stringify(allRegData));
        swal("Data Updated", "Successfully !", "success");
        closeBtn.click();
        regForm.reset();
        getUserData();
        allBtn[1].disabled = false;
        allBtn[0].disabled = true;
      };
    };
  }
};
//Get USer Data
getUserData(0, 5);
// Reading progile
allInput[5].onchange = () => {
  let fReader = new FileReader();
  fReader.readAsDataURL(allInput[5].files[0]);
  fReader.onload = (e) => {
    url = e.target.result;
    // console.log(url);
  };
};
//Delete All Data

deleteAllBtn.onclick = async () => {
  let isConfirm = await confirm();
  if (isConfirm) {
    allRegData = [];
    localStorage.removeItem("allRegData");
    getUserData();
  }
};

//Confirm PopUp
const confirm = () => {
  return new Promise((resolve, reject) => {
    swal(
      {
        title: "Are you sure?",
        text: "You will not be able to recover this imaginary file!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false,
      },
      function () {
        resolve(true);
        swal("Deleted!", "Your imaginary file has been deleted.", "success");
      }
    );
  });
};

//Searching Tech

searchEl.oninput = () => {
  search();
};

const search = () => {
  let value = searchEl.value.toLowerCase();
  let tr = tableBody.querySelectorAll("tr");
  for (let i = 0; i < tr.length; i++) {
    let allTd = tr[i].querySelectorAll("td");
    let name = allTd[2].innerHTML;
    let email = allTd[3].innerHTML;
    let mobile = allTd[4].innerHTML;
    if (name.toLowerCase().indexOf(value) != -1) {
      tr[i].style.display = "";
    } else if (email.toLowerCase().indexOf(value) != -1) {
      tr[i].style.display = "";
    } else if (mobile.toLowerCase().indexOf(value) != -1) {
      tr[i].style.display = "";
    } else {
      tr[i].style.display = "none";
    }
  }
};

// Pagination;

let length = Math.ceil(allRegData.length / 5);
let dataSkip = 0;
let loadData = 5;
for (let i = 1; i <= length; i++) {
  paginationBox.innerHTML += `
  <button data-skip="${dataSkip}" load-data="${loadData}" class="btn paginate-btn">${i}</button>
  `;
  dataSkip = dataSkip + 5;
  loadData = loadData + 5;
}

let allPaginateBtn = paginationBox.querySelectorAll(".paginate-btn");
allPaginateBtn[0].classList.add("active");
allPaginateBtn.forEach((btn, index) => {
  btn.onclick = () => {
    controlPrevAndNext(allPaginateBtn, index);
    for (let el of allPaginateBtn) {
      el.classList.remove("active");
    }
    btn.classList.add("active");
    let skip = btn.getAttribute("data-skip");
    let load = btn.getAttribute("load-data");
    getUserData(skip, load);
  };
});
//nextBtn codeing
nextBtn.onclick = () => {
  let currentIndex = 0;
  allPaginateBtn.forEach((btn, index) => {
    if (btn.classList.contains("active")) {
      currentIndex = index;
    }
  });
  allPaginateBtn[currentIndex + 1].click();
  controlPrevAndNext(allPaginateBtn, currentIndex + 1);
};
//prevBtn codeing
prevBtn.onclick = () => {
  let currentIndex = 0;
  allPaginateBtn.forEach((btn, index) => {
    if (btn.classList.contains("active")) {
      currentIndex = index;
    }
  });
  allPaginateBtn[currentIndex - 1].click();
  controlPrevAndNext(allPaginateBtn, currentIndex - 1);
};

const controlPrevAndNext = (allPaginateBtn, allcurrentIndex) => {
  let size = allPaginateBtn.length - 1;
  if (allcurrentIndex == size) {
    nextBtn.disabled = true;
    prevBtn.disabled = false;
  } else if (allcurrentIndex > 0) {
    prevBtn.disabled = false;
    nextBtn.disabled = false;
  } else {
    prevBtn.disabled = true;
    nextBtn.disabled = false;
  }
};
