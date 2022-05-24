import assert from 'assert';

describe('Database authentication system ', function () {

    describe('register', function () {

        it('should return http code 201 for creating the user without the token', function () {
            // assert.equal([1, 2, 3].indexOf(4), -1);
        });

        it('should return http code 201 for creating the user', function () {
            // assert.equal([1, 2, 3].indexOf(4), -1);
        });

        it('should return http code 409 because the email is not unique', function () {
            // assert.equal([1, 2, 3].indexOf(4), -1);
        });

        it('should return http code 409 because the username is empty', function () {
            // assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });

    describe('login', function () {

        it('should return http code 201 for creating the user without the token', function () {
            // assert.equal([1, 2, 3].indexOf(4), -1);
        });

        it('should return http code 201 for creating the user', function () {
            // assert.equal([1, 2, 3].indexOf(4), -1);
        });

        it('should return http code 409 because the email is not unique', function () {
            // assert.equal([1, 2, 3].indexOf(4), -1);
        });

        it('should return http code 409 because the username is empty', function () {
            // assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });

});

