#coding: UTF-8
$LOAD_PATH << 'modules'
require 'lib_helper'


file_variables = XML.new(File.expand_path("../files/xml/bad_1.XML", __FILE__))
#file_equipmodel = XML::XML.new(File.expand_path("../files/xml/template_equipmodel.xml", __FILE__))


variables = Variables.new(file_variables).variables

variables.each {|var| p var }

#model_helper = XML::ModelHelper.new(variables).prepare_model

#model_helper.each {|elem| p elem}

#model_link = XML::ModelLinker.new(model_helper, file_variables).link

#file_variables.write_document_to_xml model_link

#equip_model = XML::EquipModel.new(model_helper, file_equipmodel).get_ready_model
#file_equipmodel.write_document_to_xml equip_model

#изменено #3
