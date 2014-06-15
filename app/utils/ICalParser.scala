package utils

import java.io.{StringWriter, ByteArrayInputStream, FileInputStream, File}
import net.fortuna.ical4j.model.{Property, Calendar}
import net.fortuna.ical4j.data.CalendarBuilder
import com.sun.xml.internal.messaging.saaj.util.ByteInputStream
import biweekly.Biweekly
import models.EventBuilder
import org.joda.time.DateTime
import com.fasterxml.jackson.databind.ObjectMapper
import play.api.libs.json.Json
import com.fasterxml.jackson.module.scala.DefaultScalaModule


class ICalParser {
  def parseIcalFile(filePath : String) = {
    val iCalList = Biweekly.parse(new File(filePath)).first()

    val iCalEvent = iCalList.getEvents.get(0)

    val event = EventBuilder.builder
      .withUid(iCalEvent.getUid.getValue.asInstanceOf[String])
      .withStartTime(new DateTime(iCalEvent.getDateStart.getValue))
    .withSummary(iCalEvent.getSummary.getValue)
    .withDescription(iCalEvent.getDescription.getValue)
    .withLocation(iCalEvent.getLocation.getValue)
    .withGeo((iCalEvent.getGeo.getLatitude,iCalEvent.getGeo.getLongitude))
    .withEndTime(new DateTime(iCalEvent.getDateEnd.getValue))
    .build

    //TODO zainstalowac Elasticsearcha co by szybko indeksował i zwracał wydarzenia?
    //muszę się rozeznać jak się ma usuwanie indeksów po każdym wyjściu z programu

    val mapper = new ObjectMapper()
    mapper.registerModule(DefaultScalaModule)

    val out = new StringWriter
    mapper.writeValue(out, event)
    val json = out.toString
    json

  }
}
