const exportedMethods = {
  TAGS: ["math", "science", "english", "history", "art", "music", "other"],

  checkString(strVal, varName) {
    if (!strVal) throw `You must supply a ${varName}!`;
    if (typeof strVal !== "string") throw `${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `${strVal} is not a valid value for ${varName} as it only contains digits`;
    return strVal;
  },

  checkQuiz(quizVal, varName) {
    if (!quizVal) throw `You must supply a ${varName}!`;
    if (typeof quizVal.description !== "string")
      throw `${varName} must have a string property 'description'!`;
    if (!Array.isArray(quizVal.questions))
      throw `${varName} must have an array property 'questions'!`;
    if (!Array.isArray(quizVal.completed))
      throw `${varName} must have an array property 'completed' with string elements!`;
    return quizVal;
  },

  checkStatus(strVal, varName) {
    if (!strVal) throw `You must supply a ${varName}!`;
    if (typeof strVal !== "string") throw `${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `${strVal} is not a valid value for ${varName} as it only contains digits`;
    strVal = strVal.toLowerCase();
    if (!["pending", "accepted", "declined"].includes(strVal))
      throw `${strVal} is not a valid value for ${varName}, must be in ["pending", "accepted", "declined"]`;
    return strVal;
  },

  checkStringArray(arr, varName) {
    if (!arr || !Array.isArray(arr))
      throw `You must provide an array of ${varName}`;
    for (let i in arr) {
      if (typeof arr[i] !== "string" || arr[i].trim().length === 0) {
        throw `One or more elements in ${varName} array is not a string or is an empty string`;
      }
      arr[i] = arr[i].trim();
    }

    return arr;
  },

  checkVideoStringArray(arr, varName) {
    if (!arr || !Array.isArray(arr))
      throw `You must provide an array of ${varName}`;
    for (let i in arr) {
      if (
        typeof arr[i] !== "string" ||
        arr[i].trim().length === 0 ||
        !arr[i].trim().startsWith("https://www.youtube.com/embed/")
      ) {
        throw `One or more elements in ${varName} array is not a string or is an empty string or does not start with "https://www.youtube.com/embed/"`;
      }
      arr[i] = arr[i].trim();
    }

    return arr;
  },

  checkLinkStringArray(arr, varName) {
    if (!arr || !Array.isArray(arr))
      throw `You must provide an array of ${varName}`;
    for (let i in arr) {
      if (
        typeof arr[i] !== "string" ||
        arr[i].trim().length === 0 ||
        !arr[i].trim().startsWith("https://")
      ) {
        throw `One or more elements in ${varName} array is not a string or is an empty string or does not start with "https://"`;
      }
      arr[i] = arr[i].trim();
    }

    return arr;
  },

  isObject(variable) {
    return Object.prototype.toString.call(variable) === "[object Object]";
  },

  checkInt(intVal, varName) {
    if (!intVal && intVal !== 0) throw `You must supply a ${varName}!`;
    if (typeof intVal !== "number") throw `${varName} must be an integer!`;
    if (Math.trunc(intVal) !== intVal) throw `${varName} must be an integer`;
    return intVal;
  },

  checkNum(numVal, varName) {
    if (!numVal && numVal !== 0) throw `You must supply a ${varName}`;
    if (typeof numVal !== "number") throw `${varName} must be a number`;
    return numVal;
  },

  checkUsername(username, varName) {
    username = this.checkString(username, varName);
    if (username.length < 3 || username.length > 25)
      throw `${varName} must be between 3 and 25 characters (inclusive)`;
    if (username.match(/[^\w-\_]/))
      throw `${varName} can only include letters, numbers, hyphens, and underscores.`;
    return username.toLowerCase();
  },

  checkPassword(password, varName) {
    password = this.checkString(password, varName);
    if (password.length < 8) throw `${varName} must be 8 characters or longer`;
    if (!password.match(/[A-Z]/)) throw `${varName} must have a capital letter`;
    if (!password.match(/[0-9]/)) throw `${varName} must have a number`;
    if (!password.match(/[\W_]/))
      throw `${varName} must have a special character`;
    return password;
  },

  checkEmail(email, varName) {
    email = this.checkString(email, varName);
    email = email.toLowerCase();
    let atSplit = email.split("@");
    if (atSplit.length !== 2)
      throw `${varName} must have 1, and only 1, '@' character in it`;
    let dotSplit = atSplit[1].split(".");
    if (dotSplit.length < 2)
      throw `${varName} must have at least 1 '.' after the '@' character`;
    return email;
  },

  checkName(name, varName) {
    name = this.checkString(name, varName);
    if (name.length < 3 || name.length > 25)
      throw `${varName} must be between 3 and 25 characters (inclusive)`;
    if (name.match(/[^a-zA-Z\-]/))
      throw `${varName} can only include letters and hyphens`;
    return name;
  },

  checkImage(image, varName) {
    image = this.checkString(image, varName);
    if (!image.startsWith("data:image/"))
      throw `${varName} must begin with 'data:image/'`;
    return image.trim();
  },

  checkSortByCourse(sortBy, varName) {
    sortBy = this.checkString(sortBy, varName);
    sortBy = sortBy.toLowerCase();
    if (!["title", "created"].includes(sortBy))
      throw `${varName} must be either 'title' or 'created'`;
    return sortBy;
  },

  checkSortByApplication(sortBy, varName) {
    sortBy = this.checkString(sortBy, varName);
    sortBy = sortBy.toLowerCase();
    if (!["created", "username"].includes(sortBy))
      throw `${varName} must be either 'created' or 'username'`;
    return sortBy;
  },

  checkSortOrder(sortOrder, varName) {
    sortOrder = this.checkString(sortOrder, varName);
    sortOrder = sortOrder.toLowerCase();
    if (!["asc", "desc"].includes(sortOrder))
      throw `${varName} must be either 'asc' or 'desc'`;
    return sortOrder;
  },

  checkTag(tag, varName) {
    tag = this.checkString(tag, varName);
    tag = tag.toLowerCase();
    if (!this.TAGS.includes(tag))
      throw `${varName} must be one of ${this.TAGS}`;
    return tag;
  },

  checkTagList(tags, varName) {
    tags = this.checkStringArray(tags, varName);
    for (let i in tags) {
      tags[i] = this.checkTag(tags[i], "tag");
    }
    return tags;
  },
};

export default exportedMethods;
