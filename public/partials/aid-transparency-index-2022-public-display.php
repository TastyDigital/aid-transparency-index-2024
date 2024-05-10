<?php

/**
 * Provide a public-facing view for the plugin
 *
 * This file is used to markup the public-facing aspects of the plugin.
 *
 * @link       https://tastydigital.com
 * @since      1.0.0
 *
 * @package    Aid_Transparency_Index_2024
 * @subpackage Aid_Transparency_Index_2024/public/partials
 */
	$default_atts = array(
		'display' => 'barchart',
		'color' => 'blue',
		'theme' => '2020',
		'height' => '480',
		'width' => '1108',
		'agency' => ''
	);
//	$current_user = wp_get_current_user();
//	$display_name = !empty($current_user->display_name) ? $current_user->display_name : 'World';
	$args = shortcode_atts( $default_atts, $atts, 'ati-graphs-2024' );
	$uniqid = uniqid('id');
?>
<script>
    window.atiSettings = window.atiSettings || {};
    window.atiSettings["<?= $uniqid ?>"] = {
        'display': '<?= $args["display"] ?>',
        'color': '<?= $args["color"] ?>',
        'theme': '<?= $args["theme"] ?>',
      <?php  /*'name': '<?= $display_name ?>',*/ ?>
        'width': <?= $args["width"] ?>,
        'height': <?= $args["height"] ?>,
        'agency': '<?= $args["agency"] ?>',
        'selfRef': '<?= $uniqid ?>'
    }
</script>

<div class='ati-root' data-id='<?= $uniqid ?>'></div>

<?php if($args['display'] === 'graph'){
    //echo '<div class="bitmap-graph" id="graph-' . $uniqid . '" style="position:absolute;top:0;left:0;"></div>';
} ?>
