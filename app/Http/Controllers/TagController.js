const TagService     = require('../Services/TagService');
const Tag            = require('../../Models/Tag');
const TagTransformer = require('../Transformers/TagTransformer');

/**
 * List all user tags
 *
 * @param req
 * @param res
 * @param next
 *
 * @param {String} req.headers['x-access-token'] The user auth token | required
 *
 * @example success response:
 *
 *     status: 200 OK
 *
 *     [{
 *         id:          {String},
 *         name:        {String},
 *         description: {String},
 *         color:       {Number},
 *     },]
 */
const index = async function(req, res) {
    res.status(200).json(TagTransformer.collection(req.user.tags));
};

/**
 * Create a tag
 *
 * @param req
 * @param res
 * @param next
 *
 * @param {String} req.headers['x-access-token'] The user auth token             | required
 * @param {String} req.body.name                 The name of the tag          | required
 * @param {String} req.body.description          The description of the tag
 * @param {Number} req.body.color                The color of the tag
 *
 * @example success response:
 *     status: 201 CREATED
 *
 *     {
 *         id:          {String},
 *         name:        {String},
 *         description: {String},
 *         color:       {Number},
 *     }
 */
const store = async function(req, res) {
    const tag = await TagService.createUserTag(req.user, req.body.name, req.body.description, req.body.color);

    res.status(201).json(TagTransformer.make(tag));
};

/**
 * Edit a tag
 * 
 * @param req 
 * @param res 
 * @param next 
 * 
 * @param {String} req.headers['x-access-token'] The user auth token             | required
 * @param {String} req.params.tagId              The tag id                    | required
 * @param {String} req.body.name                 The name of the tag
 * @param {String} req.body.description          The description of the tag
 * @param {Number} req.body.color                The color of the tag
 * 
 * @example success response:
 *     status: 200 OK
 *
 *     {
 *         id:          {String},
 *         name:        {String},
 *         description: {String},
 *         color:       {Number},
 *     }
 */
const update = async function(req, res, next) {

};

/**
 * Delete an user tag
 * 
 * @param req 
 * @param res 
 * @param next 
 * 
 * @param {String} req.params.tagId The tag id | required
 * 
 * @example success response:
 *     status: 204 NO CONTENT
 */
const destroy = async (req, res, next) => {

};

module.exports = {
    index,
    store,
    update,
    destroy,
};