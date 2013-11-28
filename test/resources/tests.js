
/*
* Index controller tests
*/
describe('Index Controller', function(){
    describe('indexCtrl', function(){
        it('Should output ', function() {
            var scope = {},
            ctrl = new PhoneListCtrl(scope);

            //This code will auto pull in shit
            expect(scope.phones.length).toBe(3);
        });
    });
});
