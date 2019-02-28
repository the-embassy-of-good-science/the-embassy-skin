<?php

/**
 * SkinTemplate class for Momkai skin
 * @ingroup Skins
 */
class SkinTheEmbassy extends SkinTemplate
{
    var $skinname = 'theembassy', $stylename = 'TheEmbassy',
        $template = 'TheEmbassyTemplate', $useHeadElement = true;

    /**
     * This function adds JavaScript via ResourceLoader
     *
     * Use this function if your skin has a JS file(s).
     * Otherwise you won't need this function and you can safely delete it.
     *
     * @param OutputPage $out
     */
    public function initPage(OutputPage $out)
    {
        parent::initPage($out);
        $out->addModules('skins.theembassy.js'); // 'skins.theembassy.js' is the name you used in your skin.json file
    }

    /**
     * Add CSS via ResourceLoader
     *
     * @param $out OutputPage
     */
    function setupSkinUserCss(OutputPage $out)
    {
        parent::setupSkinUserCss($out);
        $out->addModuleStyles(array(
            //'mediawiki.skinning.interface', // Default mediawiki styles
            'skins.theembassy' //'skins.theembassy' is the name you used in your skin.json file
        ));
    }

}
