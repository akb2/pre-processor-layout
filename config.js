let config                      = {};


    // Имя шаблона
    config.teplate_name         = '__template_name__';


    // Общая папка вывода
    config.output               = './.dist';
    // Папка для вывода страниц относительно config.output
    config.output_pages         = '';
    // Папка списка шаблонов относительно config.output
    config.output_templates     = 'local/templates';
    // Папка текущего шаблона
    config.output_template      = config.output_templates + '/' + config.teplate_name;
    // Папка для CSS
    config.output_css           = config.output_template + '/css';
    // Папка для JavaScript
    config.output_js            = config.output_template + '/js';
    // Папка для шрифтов
    config.output_fonts         = config.output_template + '/fonts';
    // Папка для картинок
    config.output_img           = config.output_template + '/images';
    // Папка для временных файлов
    config.output_uploads       = config.output + '/uploads';

    // Имя CSS файла без расширения
    config.output_css_name      = 'styles';
    // Имя JavaScript файла без расширения
    config.output_js_name       = 'scripts';


    // Порт живого сервера
    config.live_port            = 9000;


    // Минификация CSS файлов
    config.minify_css           = true;
    // Минификация JavaScript файлов
    config.minify_js            = true;



module.exports = config;