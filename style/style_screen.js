/**
 * Created by kylejohnson on 07/09/15.
 */

window.Styles = StyleSheet.create(_.merge({},
    require('./base/'),
    require('./project/style_base'),
    require('./project/style_utilities'),
    require('./project/style_type'),
    require('./project/style_buttons'),
    require('./project/style_navs'),
    require('./project/style_forms'),
    require('./project/style_lists'),
    require('./project/style_modals'),
    require('./project/style_tables'),
    require('./project/style_custom'),
    require('./project/style_platform'),
));
