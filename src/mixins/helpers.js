import {
    mapGetters
} from 'vuex'
import {
    mapMutations
} from 'vuex'
import Helpers from './../classes/helper'
const $ = require('jquery');
const Joi = require("joi-browser");


export default {
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters(['modalID',
            'allCategories'
        ])
    },
    methods: {
        ...mapMutations(['updateSelectedCategory', 'updateSelectedNote', 'itemToDelete', 'itemToEdit']),
        isJSON(val) {
            try {
                JSON.parse(val);
                return true;
            } catch (e) {
                console.log('not json');
                return false;
            }
        },
        redirectTo(route) {
            console.log('REDIRECT TO RUNS');

            console.log(route);
        },

        randomString() {
            return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        },

        formatDate(timestamp) {
            let date = new Date((timestamp)),
                months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sept', 'oct', 'nov', 'dec'];

            let obj = {
                day: date.getDate(),
                month: months[date.getMonth()],
                monthNo: (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1,
                minutes: date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes(),
                hours: date.getHours() < 10 ? `0${date.getHours()}` : date.getHours(),
                year: date.getFullYear(),
                prefix: date.getHours() < 12 ? 'am' : 'pm',
            }
            return {
                readableDate: `${obj.day} ${obj.month} &bull; ${obj.hours}:${obj.minutes} ${obj.prefix} &bull; ${obj.year}`,
                ukDate: `${obj.day} &bull; ${obj.monthNo} &bull; ${obj.year}`,
                month: obj.month
            }
        },

        triggerModal(e) {
            const vm = this;

            let target = e.target,
                action = target.hasAttribute("data-action") ?
                target.attributes["data-action"].value :
                target.parentElement.attributes["data-action"].value,
                item;


            if (action === 'delete') {
                let targ = target.hasAttribute('data-item') ? target.attributes['data-item'].value : target.parentElement.attributes['data-item'].value;

                item = JSON.parse(targ);

                vm.itemToDelete(item);
            }

            if (action === 'edit') {
                let targ = target.hasAttribute('data-item') ? target.attributes['data-item'].value : target.parentElement.attributes['data-item'].value,
                    type = target.hasAttribute('data-item-type') ? target.attributes['data-item-type'].value : target.parentElement.attributes['data-item-type'].value;
                item = JSON.parse(targ);


                vm.itemToEdit(item);

                action = type;
            }

            // check if its note modal being opened
            if (action === "note" && this.allCategories.length <= 0) {
                // dont open modal for notes
                alert('a note cannot be created if no catgeories exist');
                return;
            }

            $(`#${vm.modalID(action)}`).modal();

        },


        categorySchema() {
            const schema = Joi.object().keys({
                title: Joi.string()
                    .min(3)
                    .max(35),
                description: Joi.string()
                    .min(0)
                    .max(255),
                colour: Joi.string().max(8)
            });

            return schema;
        },
        validateCategory() {
            const vm = this;
            let schema = this.categorySchema();

            vm.categoryDetails.description ? vm.categoryDetails.description : vm.defaultDescription();

            return Joi.validate({
                    title: vm.categoryDetails.title,
                    description: vm.categoryDetails.description,
                    colour: vm.categoryDetails.colour
                },
                schema
            );
        },


        noteSchema() {
            const schema = Joi.object().keys({
                title: Joi.string()
                    .min(3)
                    .max(35),
                brief: Joi.string()
                    .min(0)
                    .max(255),
                catID: Joi.string()
            });

            return schema;
        },
        validateNote() {
            let schema = this.noteSchema();

            const vm = this;

            return Joi.validate({
                    title: vm.noteDetails.title,
                    brief: vm.noteDetails.brief ? vm.noteDetails.brief : '...',
                    catID: vm.noteDetails.catID
                },
                schema
            );
        },
    }
}