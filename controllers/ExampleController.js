/**
 * Created by jaumard on 11/05/2015.
 */
module.exports = {
    /**
     * Can be overrided on ExampleController.js file on your sails server
     * @param req
     * @param res
     */
    test: function (req, res) {
        //res.json('ok');
        HookService.resView(req, res, 'example/views/box', 'Page de test');
    }
};