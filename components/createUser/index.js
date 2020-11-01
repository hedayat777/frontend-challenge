
function CreateAccountViewModel() {
    var self = this;

    self.firstName = ko.observable(localStorage.getItem(StorageName('name'))).extend({
        required: true,
        minLength: 2
    });
    self.emailAddress = ko.observable(localStorage.getItem(StorageName('email'))).extend({
        required: true,
        email: true
    });
    self.newsletter = ko.observable("");
    self.loading = ko.observable("");
    self.age = ko.observable(localStorage.getItem(StorageName('age')));
    // CHECK IF startStep1 NOT EXIST IN STORAGE GIVE TRUE TO IT
    self.startStep1 = ko.observable(localStorage.getItem(StorageName('startStep1')) ?
        JSON.parse(localStorage.getItem(StorageName('startStep1'))) === true ? true : false : true);
    self.startStep2 = ko.observable(JSON.parse(localStorage.getItem(StorageName('startStep2'))) == true ? true : false);
    self.lastStep = ko.observable(JSON.parse(localStorage.getItem(StorageName('lastStep'))) == true ? true : false);

    self.handleSubmitStep1 = function () {
        //Check for errors
        var errors = ko.validation.group(self);
        if (errors().length > 0) {
            errors.showAllMessages();
            return;
        }
        localStorage.setItem(StorageName('name'), self.firstName());
        localStorage.setItem(StorageName('email'), self.emailAddress());
        localStorage.setItem(StorageName('startStep1'), false);
        self.startStep1(false);
        localStorage.setItem(StorageName('startStep2'), true);
        self.startStep2(true);
        localStorage.setItem(StorageName('lastStep'), false);
        self.lastStep(false);
    };
    self.handleSubmitStep2 = function () {
        //Check for errors
        var errors = ko.validation.group(self);
        if (errors().length > 0) {
            errors.showAllMessages();
            return;
        }

        localStorage.setItem(StorageName('age'), self.age());
        localStorage.setItem(StorageName('newsletter'), self.newsletter());
        localStorage.setItem(StorageName('startStep1'), false);
        localStorage.setItem(StorageName('startStep2'), false);
        localStorage.setItem(StorageName('lastStep'), true);
        self.startStep1(false);
        self.startStep2(false);
        self.lastStep(true);

    };

    self.handleBackStep2 = function () {
        localStorage.setItem(StorageName('startStep1'), false);
        localStorage.setItem(StorageName('startStep2'), true);
        localStorage.setItem(StorageName('lastStep'), false);
        self.startStep1(false);
        self.startStep2(true);
        self.lastStep(false);
    };
    self.handleBackStep1 = function () {
        localStorage.setItem(StorageName('startStep1'), true);
        localStorage.setItem(StorageName('startStep2'), false);
        localStorage.setItem(StorageName('lastStep'), false);
        self.startStep1(true);
        self.startStep2(false);
        self.lastStep(false);
    };

    self.handleSendToApi = function () {
        var User = {
            name: self.firstName(),
            age: self.age(),
            email: self.emailAddress(),
            newsletter: self.newsletter(),
        };
        self.loading(true)
        createUser(User).then(
            (res) => {
                console.log(res)
                alert('Create ' + res.user.name + ' As a user correctly')
                self.loading(false)
            }
        ).catch(
            (err) => {
                console.log(err)
                self.loading(false)
            }
        )
    }

}
const knockoutApp = document.querySelector("#knockout-app");
ko.applyBindings(new CreateAccountViewModel(), knockoutApp);