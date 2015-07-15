#coding: UTF-8
$LOAD_PATH << 'modules'
require 'parse_html'
require 'parse_xml'



file_variables = XML::XML.new("C:/Users/modzhuk_vv/Desktop/bad_1.XML")
#file_equipmodel = XML::XML.new(File.expand_path("../files/xml/template_equipmodel.xml", __FILE__))


variables = XML::Variables.new(file_variables).variables








#model_helper = XML::ModelHelper.new(variables).prepare_model

#model_helper.each {|elem| p elem}

#XML::ModelLinker.new(model_helper, file_variables).link

#file.write_document_to_xml model

#equip_model = XML::EquipModel.new(model_helper, file_equipmodel).get_ready_model
#file_equipmodel.write_document_to_xml equip_model

#изменено #3
